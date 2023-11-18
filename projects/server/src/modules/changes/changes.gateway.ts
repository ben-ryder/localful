import {ChangesService} from "./changes.service";
import {Socket} from "socket.io";
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway
} from "@nestjs/websockets";
import {UseGuards, UsePipes} from "@nestjs/common";
import {ChangesEvents, ResourceChangesDto} from "@localful/common";
import {GatewayErrorFilter} from "../../services/errors/error.gateway-filter";
import {ZodValidationPipe} from "../../common/zod-validation.pipe";
import {AuthService} from "../auth/auth.service";
import {TokenService} from "../../services/token/token.service";
import {AuthGatewayGuard} from "../auth/auth.guards";
import {SocketWithContext} from "../../common/socket-context.decorator";


@WebSocketGateway()
@UsePipes(
  GatewayErrorFilter
)
@UseGuards(AuthGatewayGuard)
export class ChangesGateway implements OnGatewayConnection {
  constructor(
    private changesService: ChangesService,
    private authService: AuthService,
  ) {}

  getSocketUser(socket: SocketWithContext) {
    return socket.context?.user
  }

  async handleConnection(socket: SocketWithContext) {
    const currentUser = this.getSocketUser(socket)

    /**
     * If the requesting user is valid, let them join their room to listen for changes.
     * If the user has no valid token, immediately disconnect the socket.
     */
    if (currentUser) {
      socket.join(currentUser.id);
    }
    else {
      socket.disconnect();
    }
  }

  // todo: use types/keys from common package
  @SubscribeMessage("changes")
  async onChanges(
    @ConnectedSocket() socket: SocketWithContext,
    @MessageBody(new ZodValidationPipe(ResourceChangesDto)) resourceChangesDto: ResourceChangesDto
  ) {
    // todo: need to validate socket/user on every event?

    const currentUser = this.getSocketUser(socket)
    if (!currentUser) {
      socket.disconnect()
      return;
    }

    // Immediately emit the change for other connected clients, which should
    // prevent synchronisation being delayed by database writes.
    socket.to(currentUser.id).emit("changes", resourceChangesDto);

    // Add the change to the database
    // Failures here don't matter too much, due to the nature of local-first software
    // the changes can always just be sent again at a later stage.
    // todo: send failure ack to client?
    await this.changesService.createMany(currentUser, resourceChangesDto.resourceId, resourceChangesDto.changes);
  }
}

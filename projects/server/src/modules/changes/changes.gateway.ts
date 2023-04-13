import {ChangesService} from "./changes.service";
import {Socket} from "socket.io";
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway
} from "@nestjs/websockets";
import {ChangesSocketEvents, ChangesEventPayload} from "@ben-ryder/lfb-common";
import {UsePipes} from "@nestjs/common";
import {GatewayErrorFilter} from "../../services/errors/error.gateway-filter";
import {ZodValidationPipe} from "../../common/zod-validation.pipe";
import {AuthService} from "../../services/auth/auth.service";

@WebSocketGateway()
@UsePipes(
  GatewayErrorFilter
)
export class ChangesGateway implements OnGatewayConnection {
  constructor(
    private changesService: ChangesService,
    private authService: AuthService
  ) {}

  async handleConnection(socket: Socket) {
    const currentUser = await this.authService.validateToken(socket.handshake.auth.token);

    /**
     * If the requesting user is valid, let them join their room to listen for changes.
     * If the user has no valid token, immediately disconnect the socket.
     */
    if (currentUser) {
      socket.join(currentUser.userId);
    }
    else {
      socket.disconnect();
    }
  }

  @SubscribeMessage(ChangesSocketEvents.changes)
  async onChanges(
    @ConnectedSocket() socket: Socket,
    @MessageBody(new ZodValidationPipe(ChangesEventPayload)) payload: ChangesEventPayload
  ) {
    const currentUser = await this.authService.validateToken(socket.handshake.auth.token);

    // The token may no longer be valid, in which case close the socket so the client has to
    // re-supply a valid token.
    if (!currentUser) {
      socket.disconnect();
      return;
    }

    // Immediately emit the change for other connected clients, which should
    // prevent synchronisation being delayed by database writes.
    socket.to(currentUser.userId).emit(ChangesSocketEvents.changes, payload);

    // Add the change to the database
    // Failures here don't matter too much, due to the nature of local-first software
    // the changes can always just be sent and backed up at a later stage.
    await this.changesService._create(currentUser.userId, payload);
  }
}

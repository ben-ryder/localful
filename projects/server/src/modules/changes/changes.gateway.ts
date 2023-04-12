import {ChangesService} from "./changes.service";
import {Socket} from "socket.io";
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway
} from "@nestjs/websockets";
import {ChangesSocketEvents, ChangesEventPayload, AccessControlScopes} from "@ben-ryder/lfb-common";
import {UseGuards, UsePipes} from "@nestjs/common";
import {GatewayErrorFilter} from "../../services/errors/error.gateway-filter";
import {ZodValidationPipe} from "../../common/zod-validation.pipe";
import {AuthGatewayGuard} from "../../services/auth/auth.gateway-guard";
import {AuthService} from "../../services/auth/auth.service";

@WebSocketGateway()
@UseGuards(AuthGatewayGuard)
@UsePipes(
  GatewayErrorFilter
)
export class ChangesGateway implements OnGatewayConnection {
  constructor(
    private changesService: ChangesService,
    private authService: AuthService
  ) {}

  async handleConnection(socket: Socket) {

    this.authService.confirmAccessControlRules([
      AccessControlScopes.
    ])

    //await this.guardConnection(socket);
    // how to join user socket if the id isn't in the token or initial connection?
    if (socket.handshake.auth.userId) {
      // todo: should be based on access token instead?
      socket.join(socket.handshake.auth.userId);
    }
  }

  @SubscribeMessage(ChangesSocketEvents.changes)
  async onChanges(
    @ConnectedSocket() socket: Socket,
    @MessageBody(new ZodValidationPipe(ChangesEventPayload)) payload: ChangesEventPayload
  ) {
    //this.changesService.controlAccess(null, payload.userId);

    // Immediately emit the change for other connected clients
    socket.to(payload.userId).emit(ChangesSocketEvents.changes, payload);

    // Add the change to the database
    await this.changesService.add(null, payload.userId, payload.changes);
  }
}

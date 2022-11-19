import {ChangesService} from "./changes.service";
import {Socket} from "socket.io";
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway
} from "@nestjs/websockets";
import {AccessUnauthorizedError} from "../../services/errors/access/access-unauthorized.error";
import {ChangesSocketEvents, ChangesEventPayload} from "@ben-ryder/lfb-common";
import {UseGuards, UsePipes} from "@nestjs/common";
import {GatewayErrorFilter} from "../../services/errors/error.gateway-filter";
import {ZodValidationPipe} from "@anatine/zod-nestjs";

@WebSocketGateway()
// @UseGuards(AuthGatewayGuard)
@UsePipes(
  ZodValidationPipe,
  GatewayErrorFilter
)
export class ChangesGateway implements OnGatewayConnection {
  constructor(
    private changesService: ChangesService,
  ) {}

  async guardConnection(socket: Socket) {
    const accessToken = socket.handshake.auth.accessToken;
    if (!accessToken) {
      // This is included just in case, however the AuthGatewayGuard should catch any unauthorized events/requests.
      throw new AccessUnauthorizedError({
        message: "Socket Access Denied"
      })
    }

    // todo: validate token as well?
    // This is required because the auth guard runs against events, not the initial connection
  }

  async handleConnection(socket: Socket) {
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
    @MessageBody() payload: ChangesEventPayload
  ) {
    //this.changesService.controlAccess(null, payload.userId);

    // Immediately emit the change for other connected clients
    socket.to(payload.userId).emit(ChangesSocketEvents.changes, payload);

    // Add the change to the database
    await this.changesService.add(null, payload.userId, payload.changes);
  }
}

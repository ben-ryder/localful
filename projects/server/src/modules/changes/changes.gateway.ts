import {ChangesService} from "./changes.service";
import {Socket} from "socket.io";
import {TokenService} from "../../services/token/token.service";
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway
} from "@nestjs/websockets";
import {AccessUnauthorizedError} from "../../common/errors/access/access-unauthorized.error";
import {ZodValidationPipe} from "../../common/schemas/zod-validation.pipe";
import {AddChangesRequest} from "../../common/schemas/changes/request/add.changes.request";
import {UseGuards, UsePipes} from "@nestjs/common";
import {AuthGatewayGuard} from "../auth/auth.gateway-guard";
import {GatewayErrorFilter} from "../../common/errors/error.gateway-filter";

// todo: add to js-lib
export enum ChangesSocketEvents {
  changes = "changes"
}

@WebSocketGateway()
@UseGuards(AuthGatewayGuard)
@UsePipes(GatewayErrorFilter)
export class ChangesGateway implements OnGatewayConnection {
  constructor(
    private changesService: ChangesService,
    private tokenService: TokenService
  ) {}

  async getUserIdFromSocket(socket: Socket): Promise<string> {
    const accessToken = socket.handshake.auth.accessToken;
    if (accessToken) {
      const payload = await this.tokenService.validateAndDecodeAccessToken(accessToken);
      if (payload) {
        return payload.userId;
      }
    }

    // This is included just in case, however the AuthGatewayGuard should catch any unauthorized events/requests.
    throw new AccessUnauthorizedError({
      message: "Socket Access Denied"
    })
  }

  async handleConnection(socket: Socket) {
    const userId = await this.getUserIdFromSocket(socket);
    socket.join(userId);
  }

  @SubscribeMessage(ChangesSocketEvents.changes)
  async onChanges(
    @ConnectedSocket() socket: Socket,
    @MessageBody(new ZodValidationPipe(AddChangesRequest)) changes: AddChangesRequest
  ) {
    const userId = await this.getUserIdFromSocket(socket);

    // Immediately emit the change for other connected clients
    socket.to(userId).emit(ChangesSocketEvents.changes, changes);

    // Add the change to the database
    await this.changesService.add(userId, changes);
  }
}
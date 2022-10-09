import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import {TokenService} from "../../services/token/token.service";
import {AccessForbiddenError} from "../../common/errors/access/access-forbidden.error";
import {ErrorIdentifiers} from "@ben-ryder/lfb-common";
import {AccessUnauthorizedError} from "../../common/errors/access/access-unauthorized.error";
import {Socket} from "socket.io";


@Injectable()
export class AuthGatewayGuard implements CanActivate {
  constructor(
    private tokenService: TokenService
  ) {}

  canActivate(
    context: ExecutionContext,
  ): Promise<boolean> | boolean {
    const socket = context.switchToWs().getClient<Socket>();
    return this.validateSocket(socket);
  }

  async validateSocket(socket: Socket) {
    const accessToken = socket.handshake.auth.accessToken;

    if (accessToken) {
      const payload = await this.tokenService.validateAndDecodeAccessToken(accessToken);

      if (payload) {
        if (!payload.userIsVerified) {
          throw new AccessForbiddenError({
            identifier: ErrorIdentifiers.AUTH_EMAIL_NOT_VERIFIED,
            applicationMessage: "You must verify your account email before you can use Athena."
          })
        }

        return true;
      }
    }

    throw new AccessUnauthorizedError({
      message: "Request Access Denied"
    })
  }
}

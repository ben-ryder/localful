import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import {TokenService} from "../../services/token/token.service";
import {AccessForbiddenError} from "../../common/errors/access/access-forbidden.error";
import {ErrorIdentifiers} from "../../common/errors/error-identifiers";
import {AccessUnauthorizedError} from "../../common/errors/access/access-unauthorized.error";
import {RequestWithContext} from "../../common/request-context.decorator";


@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private tokenService: TokenService
  ) {}

  canActivate(
    context: ExecutionContext,
  ): Promise<boolean> | boolean {
    const request = context.switchToHttp().getRequest();
    return this.validateRequest(request);
  }

  async validateRequest(req: RequestWithContext) {
    const authorizationHeader = req.header("authorization");

    if (authorizationHeader) {
      const accessToken = authorizationHeader.split(" ")[1];
      const accessTokenPayload = await this.tokenService.validateAndDecodeAccessToken(accessToken);

      if (accessTokenPayload) {
        if (!accessTokenPayload.userIsVerified) {
          throw new AccessForbiddenError({
            identifier: ErrorIdentifiers.AUTH_EMAIL_NOT_VERIFIED,
            applicationMessage: "You must verify your account email before you can use Athena."
          })
        }

        if (req.context) {
          req.context.user = {
            id: accessTokenPayload.userId,
            isVerified: accessTokenPayload.userIsVerified
          }
        }
        else {
          req.context = {
            user: {
              id: accessTokenPayload.userId,
              isVerified: accessTokenPayload.userIsVerified
            }
          }
        }

        return true;
      }
    }

    throw new AccessUnauthorizedError({
      message: "Request Access Denied"
    })
  }
}

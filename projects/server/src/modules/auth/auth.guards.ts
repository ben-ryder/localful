import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import {TokenService} from "../../services/token/token.service";
import {ErrorIdentifiers} from "@ben-ryder/lfb-common";
import {RequestWithContext, UserContext} from "../../common/request-context.decorator";
import {AccessForbiddenError} from "../../services/errors/access/access-forbidden.error";
import {AccessUnauthorizedError} from "../../services/errors/access/access-unauthorized.error";
import {AccessControlOptions} from "./access-control";
import {Socket} from "socket.io";

/**
 * A function that validates the supplied access token.
 * Returns the user context if valid, throws an error if not.
 *
 * @param accessToken
 * @param accessControl
 */
async function validateAccessToken(accessToken: string, accessControl?: AccessControlOptions): Promise<UserContext> {
  const accessTokenPayload = await this.tokenService.validateAndDecodeAccessToken(accessToken);

  // Control access to unverified users if required.
  if (accessControl?.isVerified || !accessTokenPayload.isVerified) {
    throw new AccessForbiddenError({
      identifier: ErrorIdentifiers.AUTH_EMAIL_NOT_VERIFIED,
      applicationMessage: "You must verify your account email address before you an perform this action."
    })
  }

  // RBAC check for users if required.
  if (accessControl?.roles) {
    let hasValidRole = false;

    for (const role of accessControl.roles) {
      if (accessTokenPayload.roles.includes(role)) {
        hasValidRole = true;
      }
    }

    if (!hasValidRole) {
      throw new AccessForbiddenError({
        applicationMessage: "You do not have the role required to perform this action."
      })
    }
  }

  return {
    isVerified: accessTokenPayload.isVerified,
    id: accessTokenPayload.sub,
    roles: accessTokenPayload.roles
  }
}


@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private tokenService: TokenService
  ) {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authorizationHeader = request.header("authorization");
    if (authorizationHeader) {
      const accessToken = authorizationHeader.split(" ")[1];

      if (accessToken) {
        const userContext = await validateAccessToken(accessToken);
        this.attachRequestContext(request, userContext);
        return true;
      }
    }

    throw new AccessUnauthorizedError({
      message: "Request Access Denied"
    })
  }

  attachRequestContext(req: RequestWithContext, userContext: UserContext) {
    if (req.context) {
      req.context.user = userContext;
    }
    else {
      req.context = {
        user: userContext
      }
    }
  }
}


@Injectable()
export class AuthGatewayGuard implements CanActivate {
  constructor(
    private tokenService: TokenService
  ) {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const socket = context.switchToWs().getClient<Socket>();
    const accessToken = socket.handshake.auth.accessToken;
    if (accessToken) {
      const userContext = await validateAccessToken(accessToken);
      return true;
    }

    throw new AccessUnauthorizedError({
      message: "Request Access Denied"
    })
  }
}

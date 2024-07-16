import {CanActivate, ExecutionContext, Injectable, mixin} from "@nestjs/common";
import {TokenService} from "../../services/token/token.service";
import {RequestWithContext, UserContext} from "../../common/request-context.decorator";
import {AccessUnauthorizedError} from "../../services/errors/access/access-unauthorized.error";
import {Socket} from "socket.io";
import {Permissions} from "@localful/common";
import {AuthService} from "./auth.service";
import {AccessForbiddenError} from "../../services/errors/access/access-forbidden.error";

export interface AccessControlOptions {
  /** A list of valid permissions, if the requesting user context matches the target user **/
  userScopedPermissions: Permissions[],
  /** A list of valid permissions regardless of requesting user matching target user **/
  globalScopedPermissions: Permissions[],
  /** The user context requesting this action **/
  requestingUserContext: UserContext,
  /** The target user id of the given action **/
  targetUserId: string
}

export interface AuthGuardOptions {
  allowUnverifiedUser: boolean
}

export function createAuthGuard(options?: AuthGuardOptions) {
  @Injectable()
  class AuthGuard implements CanActivate {
    constructor(
        // todo: Must be public to prevent issue TS4094. Can this be fixed, or does it need to be?
        public tokenService: TokenService
    ) {}

    async canActivate(
        context: ExecutionContext,
    ): Promise<boolean> {
      const request = context.switchToHttp().getRequest();
      const authorizationHeader = request.header("authorization");
      if (authorizationHeader) {
        const accessToken = authorizationHeader.split(" ")[1];

        // todo: this is reused in AuthGatewayGuard. Should be a seperate function?
        if (accessToken) {
          const tokenPayload = await this.tokenService.validateAndDecodeAccessToken(accessToken);

          if (tokenPayload) {
            if (!tokenPayload.isVerified && !options?.allowUnverifiedUser) {
              throw new AccessForbiddenError({
                message: "You are unverified and unauthorized to perform that action"
              })
            }

            const userContext: UserContext = {
              id: tokenPayload.sub,
              isVerified: tokenPayload.isVerified,
              permissions: AuthService.resolveRolePermissions(tokenPayload.role)
            }

            this.attachRequestContext(request, userContext);
            return true;
          }
        }
      }

      throw new AccessUnauthorizedError({
        message: "You are not authorized to perform that action"
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

  return mixin(AuthGuard);
}


export function createAuthGatewayGuard(options: AuthGuardOptions) {
  @Injectable()
  class AuthGatewayGuard implements CanActivate {
    constructor(
        public tokenService: TokenService
    ) {}

    async canActivate(
        context: ExecutionContext,
    ): Promise<boolean> {
      const socket = context.switchToWs().getClient<Socket>();

      const accessToken = socket.handshake?.auth?.accessToken;
      if (accessToken) {
        const tokenPayload = await this.tokenService.validateAndDecodeAccessToken(accessToken);

        if (tokenPayload) {
          if (tokenPayload.isVerified && !options?.allowUnverifiedUser) {
            throw new AccessForbiddenError({
              message: "You are unverified and unauthorized to perform that action"
            })
          }

          const userContext: UserContext = {
            id: tokenPayload.sub,
            isVerified: tokenPayload.isVerified,
            permissions: AuthService.resolveRolePermissions(tokenPayload.role)
          }

          this.attachSocketContext(socket, userContext);
          return true;
        }
      }

      throw new AccessUnauthorizedError({
        message: "Request Access Denied"
      })
    }

    attachSocketContext(socket: Socket, userContext: UserContext) {
      // todo: add SocketWithContext type for this, like I do with RequestWithContext
      // @ts-ignore
      socket.user = userContext
    }
  }

  return mixin(AuthGatewayGuard);
}

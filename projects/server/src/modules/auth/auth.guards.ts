import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import {TokenService} from "../../services/token/token.service.js";
import {RequestWithContext, UserContext} from "../../common/request-context.decorator.js";
import {AccessUnauthorizedError} from "../../services/errors/access/access-unauthorized.error.js";
import {Socket} from "socket.io";
import {Permissions, RolePermissions, Roles} from "@localful/common";

export interface AccessControlOptions {
  /** A list of valid permissions **/
  validPermissions: Permissions[],
  /** The user context requesting this action **/
  requestingUserContext: UserContext,
  /** The target user id of the given action **/
  targetUserId: string
}

/**
 * Get the permissions associated with the given role.
 * This function includes resolving all inherited permissions too.
 *
 * @param role
 */
function resolveRolePermissions(role: Roles): Permissions[] {
  const permissionProfile = RolePermissions[role]
  let permissions = permissionProfile.permissions

  if (permissionProfile.inherit) {
    permissions = permissions.concat(resolveRolePermissions(permissionProfile.inherit))
  }

  return permissions
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
        const tokenPayload = await this.tokenService.validateAndDecodeAccessToken(accessToken);

        if (tokenPayload) {
          const userContext: UserContext = {
            id: tokenPayload.sub,
            isVerified: tokenPayload.isVerified,
            permissions: resolveRolePermissions(tokenPayload.role)
          }

          this.attachRequestContext(request, userContext);
          return true;
        }
      }
    }

    throw new AccessUnauthorizedError({
      message: "You are not authorized"
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

    const accessToken = socket.handshake?.auth?.accessToken;
    if (accessToken) {
      const tokenPayload = await this.tokenService.validateAndDecodeAccessToken(accessToken);

      if (tokenPayload) {
        const userContext: UserContext = {
          id: tokenPayload.sub,
          isVerified: tokenPayload.isVerified,
          permissions: resolveRolePermissions(tokenPayload.role)
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

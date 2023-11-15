import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import {TokenService} from "../../services/token/token.service.js";
import {RequestWithContext, UserContext} from "../../common/request-context.decorator.js";
import {AccessUnauthorizedError} from "../../services/errors/access/access-unauthorized.error.js";
import {ACCESS_CONTROL_METADATA_KEY, AccessControlOptions} from "./access-control.js";
import {Socket} from "socket.io";
import {Reflector} from "@nestjs/core";


@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private tokenService: TokenService,
    private reflector: Reflector
  ) {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authorizationHeader = request.header("authorization");
    if (authorizationHeader) {
      const accessToken = authorizationHeader.split(" ")[1];

      if (accessToken) {
        const accessControl = this.reflector.getAllAndOverride<AccessControlOptions|undefined>(ACCESS_CONTROL_METADATA_KEY, [
          context.getHandler(),
          context.getClass(),
        ]);

        const userContext = await this.tokenService.validateAccessToken(accessToken, accessControl);
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
    private tokenService: TokenService,
    private reflector: Reflector
  ) {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const socket = context.switchToWs().getClient<Socket>();
    const accessToken = socket.handshake.auth.accessToken;
    if (accessToken) {
      const accessControl = this.reflector.getAllAndOverride<AccessControlOptions|undefined>(ACCESS_CONTROL_METADATA_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);

      const userContext = await this.tokenService.validateAccessToken(accessToken, accessControl);
      return true;
    }

    throw new AccessUnauthorizedError({
      message: "Request Access Denied"
    })
  }
}

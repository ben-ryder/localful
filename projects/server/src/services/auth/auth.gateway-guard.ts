import {CanActivate, ExecutionContext, Injectable} from "@nestjs/common";
import {Reflector} from "@nestjs/core";
import {AccessUnauthorizedError} from "../errors/access/access-unauthorized.error";
import {ACCESS_CONTROL_METADATA_KEY, AccessControlOptions, AuthService} from "./auth.service";
import {Socket} from "socket.io";


@Injectable()
export class AuthGatewayGuard implements CanActivate {
	constructor(
		private authService: AuthService,
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

			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const validationResult = await this.authService.validateToken(accessToken, accessControl?.scopes);
			return true;
		}

		throw new AccessUnauthorizedError({
			message: "Request Access Denied"
		})
	}
}

import {CanActivate, ExecutionContext, Injectable} from "@nestjs/common";
import {Reflector} from "@nestjs/core";
import {AccessUnauthorizedError} from "../errors/access/access-unauthorized.error.js";
import {RequestWithContext, UserContext} from "../../common/request-context.decorator.js";
import {AuthService} from "./auth.service.js";


@Injectable()
export class AuthGuard implements CanActivate {
	constructor(
		private authService: AuthService,
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
				const validationResult = await this.authService.validateToken(accessToken);
				this.attachRequestContext(request, {
					id: validationResult.userId,
					scopes: validationResult.scopes
				});

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

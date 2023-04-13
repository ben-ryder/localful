import {Injectable} from "@nestjs/common";
import {ConfigService} from "../config/config";
import {createRemoteJWKSet, JWTPayload, jwtVerify} from "jose";
import {AccessForbiddenError} from "../errors/access/access-forbidden.error";
import {AccessUnauthorizedError} from "../errors/access/access-unauthorized.error";
import {UserContext} from "../../common/request-context.decorator";

export interface AuthValidationResult {
	userId: string,
	scopes: string[]
}

export interface ExpectedJWTPayload extends JWTPayload {
	scope?: string
}

@Injectable()
export class AuthService {
	constructor(
		private configService: ConfigService
	) {}

	/**
	 * Validate the given token
	 *
	 * @param token
	 */
	async validateToken(token: string): Promise<AuthValidationResult> {
		const jwksOrigin = this.configService.config.auth.jwksOrigin;
		const jwksPath = this.configService.config.auth.jwksPath;
		const jwksUri= new URL(jwksOrigin + jwksPath);

		const audience = this.configService.config.auth.audience;
		const issuer = this.configService.config.auth.audience;

		let payload;
		try {
			const { payload: josePayload } = await jwtVerify(
				token,
				createRemoteJWKSet(jwksUri),
				{
					issuer: issuer,
					audience: audience,
				}
			);

			payload = josePayload as ExpectedJWTPayload;
		}
		catch (e) {
			throw new AccessUnauthorizedError({
				message: "access token failed verification/decryption",
				originalError: e
			})
		}

		const userId = payload.sub;
		if (!userId) {
			throw new AccessUnauthorizedError({
				applicationMessage: "missing required `sub` claim of token"
			})
		}

		return {
			userId,
			scopes: payload.scope ? payload.scope.split(" ") : []
		}
	}

	/**
	 * A helper function other services can use to check access control rules.
	 * Will throw AccessForbiddenError if no rule is met.
	 *
	 * @param validScopes
	 * @param currentUserContext
	 * @param userId
	 */
	async confirmAccessControlRules(
		validScopes: string[],
		currentUserContext: UserContext,
		userId: string
	): Promise<void> {
		for (const scope of validScopes) {
			if (currentUserContext?.scopes.includes(scope)) {
				if (!scope.endsWith(":self")) {
					return;
				}
				else if (currentUserContext?.id === userId) {
					return;
				}
			}
		}

		throw new AccessForbiddenError();
	}
}

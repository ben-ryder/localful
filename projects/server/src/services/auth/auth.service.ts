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

export interface AccessControlRule {
	scopes: string[],
	combineBehaviour: "or" | "and"
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
		const jwksUri= new URL(this.configService.config.auth.jwksUri);
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
	 * @param accessControlRule
	 * @param currentUserContext
	 * @param userId
	 */
	async confirmAccessControlRules(
		accessControlRule: AccessControlRule,
		currentUserContext: UserContext,
		userId: string
	): Promise<void> {
		let hasScopeMissing = false;
		let hasValidScope = false;

		for (const scope of accessControlRule.scopes) {
			if (currentUserContext?.scopes.includes(scope)) {
				if (!scope.endsWith(":self")) {
					hasValidScope = true;
				}
				else if (currentUserContext?.id === userId) {
					hasValidScope = true;
				}
			}
			else {
				hasScopeMissing = true;
			}
		}

		if (accessControlRule.combineBehaviour === "or" && hasValidScope) {
			return;
		}
		else if (accessControlRule.combineBehaviour === "and" && hasValidScope && !hasScopeMissing) {
			return;
		}

		throw new AccessForbiddenError();
	}
}

import {UserContext} from "@common/request-context.js";
import {Request} from "express"
import {AccessUnauthorizedError} from "@services/errors/access/access-unauthorized.error.js";
import authService from "@modules/auth/auth.service.js";
import {Permissions} from "@localful/common";


export interface AccessControlOptions {
  /** A list of valid permissions if the requesting user context matches the target user **/
  userScopedPermissions: Permissions[],
  /** A list of valid permissions regardless of requesting user matching target user **/
  unscopedPermissions: Permissions[],

  /** The user context requesting this action **/
  requestingUserContext: UserContext,
  /** The target user id of the given action **/
  targetUserId: string

  /** Allow the requesting user to be unverified **/
  allowUnverifiedRequestingUser?: boolean
  /** Allow target user to be unverified **/
  allowUnverifiedTargetUser?: boolean
}


/**
 * An authentication guard which sits at the controller layer.
 * It ensures users are authenticated and adds user context to the request.
 *
 * THIS GUARD DOES NOT HANDLE AUTHORIZATION WHICH IS LOGIC FOR THE SERVICE LAYER.
 */
export async function validateAuthentication(req: Request): Promise<UserContext> {
  const authorizationHeader = req.header("authorization");
  if (authorizationHeader) {
    const accessToken = authorizationHeader.split(" ")[1];

    // todo: this is reused in AuthGatewayGuard. Should be a separate function?
    if (accessToken) {
      const tokenPayload = await this.tokenService.validateAndDecodeAccessToken(accessToken);

      if (tokenPayload) {
        return {
          id: tokenPayload.sub,
          verifiedAt: tokenPayload.verifiedAt,
          permissions: authService.resolveRolePermissions(tokenPayload.role)
        }
      }
    }
  }

  throw new AccessUnauthorizedError({
    message: "You are not authorized to perform that action"
  })
}


import {ForbiddenException, forwardRef, Inject, Injectable} from "@nestjs/common";
import {UsersService} from "../users/users.service";
import {TokenService} from "../../services/token/token.service";
import {
  AuthUserResponse,
  TokenPair,
  ErrorIdentifiers,
  Roles,
  RolePermissions,
  Permissions,
} from "@localful/common";
import {PasswordService} from "../../services/password/password.service";
import {AccessForbiddenError} from "../../services/errors/access/access-forbidden.error";
import {AccessUnauthorizedError} from "../../services/errors/access/access-unauthorized.error";
import {UserRequestError} from "../../services/errors/base/user-request.error";
import {DatabaseUserDto} from "../users/database/database-user";
import {AccessControlOptions} from "./auth.guards";
import {ResourceNotFoundError} from "../../services/errors/resource/resource-not-found.error";
import {UserContext} from "../../common/request-context.decorator";
import {ConfigService} from "../../services/config/config";
import {EmailService} from "../../services/email/email.service";


@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
    private tokenService: TokenService,
    private configService: ConfigService,
    private emailService: EmailService,
  ) {}

  async login(email: string, password: string): Promise<AuthUserResponse> {
    let databaseUserDto: DatabaseUserDto;

    try {
      databaseUserDto = await this.usersService.getDatabaseUser(email);
    }
    catch (e) {
       throw new AccessForbiddenError({
         identifier: ErrorIdentifiers.AUTH_CREDENTIALS_INVALID,
         message: "The supplied email & password combination is invalid.",
         applicationMessage: "The supplied email & password combination is invalid."
       });
    }

    const passwordValid = await PasswordService.checkPassword(password, databaseUserDto.passwordHash);
    if (!passwordValid) {
      throw new AccessForbiddenError({
       identifier: ErrorIdentifiers.AUTH_CREDENTIALS_INVALID,
       message: "The supplied email & password combination is invalid.",
       applicationMessage: "The supplied email & password combination is invalid."
     });
    }

    const userDto = this.usersService.convertDatabaseDto(databaseUserDto);
    const tokens = await this.tokenService.createNewTokenPair(userDto);

    return {
      tokens: {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken
      },
      user: userDto,
    }
  }

  async refresh(refreshToken: string): Promise<TokenPair> {
    const tokenPayload = await this.tokenService.validateAndDecodeRefreshToken(refreshToken);

    if (!tokenPayload) {
      throw new AccessUnauthorizedError({
        identifier: ErrorIdentifiers.AUTH_TOKEN_INVALID,
        message: "The supplied refresh token is invalid.",
        applicationMessage: "The supplied refresh token is invalid."
      });
    }

    // As the token has been validated the supplied userId/sub value in the token can be trusted in theory
    // If the user isn't found, the user service will throw an error.
    // todo: the user service throwing an error not returning null makes the error handling here unclear.
    const userDto = await this.usersService._UNSAFE_get(tokenPayload.sub);

    return await this.tokenService.getRefreshedTokenPair(userDto, tokenPayload.gid);
  }

  async logout(refreshToken: string) {
    const tokenPayload = await this.tokenService.validateAndDecodeRefreshToken(refreshToken);

    if (!tokenPayload) {
      throw new UserRequestError({
        identifier: ErrorIdentifiers.AUTH_TOKEN_INVALID,
        applicationMessage: "The refresh token supplied is either invalid or already expired."
      });
    }

    await this.tokenService.blacklistTokenGroup(tokenPayload.gid, tokenPayload.exp);
  }

  /**
   * A function that validates the supplied access token against
   * Returns the user context if valid, throws an error if not.
   *
   * @param options
   */
  async validateAccessControlRules(options: AccessControlOptions): Promise<void> {
    // Validate the requesting users verification first, as they shouldn't be able to do anything when unverified even if they have valid permissions.
    if (!options.requestingUserContext.verifiedAt && !options.allowUnverifiedRequestingUser) {
      throw new AccessForbiddenError({
        identifier: ErrorIdentifiers.AUTH_NOT_VERIFIED,
        applicationMessage: "You are unverified and do not have the permissions required to perform this action."
      });
    }

    let hasValidPermission = false;
    for (const userPermission of options.userScopedPermissions) {
      if (
        options.requestingUserContext?.permissions.includes(userPermission) &&
        options.requestingUserContext.id === options.targetUserId
      ) {
        hasValidPermission = true;
        break
      }
    }
    for (const globalPermission of options.unscopedPermissions) {
      if (
        options.requestingUserContext?.permissions.includes(globalPermission)
      ) {
        hasValidPermission = true;
        break
      }
    }

    if (!hasValidPermission) {
      throw new AccessForbiddenError({
        applicationMessage: "You do not have the permissions required to perform this action."
      });
    }

    // Check target user permissions AFTER permission checks.
    // This ensures no target user information (like verification status) will be exposed to users that only have
    // permissions to access their own data.
    if (!options.allowUnverifiedTargetUser && options.requestingUserContext.id !== options.targetUserId) {

      let targetUser
      try {
        targetUser = await this.usersService._UNSAFE_get(options.targetUserId)
      }
      catch (e) {
        // Rethrow a user not found error as a request error
        if (e instanceof ResourceNotFoundError && e.identifier === ErrorIdentifiers.USER_NOT_FOUND) {
          throw new UserRequestError({
            identifier: ErrorIdentifiers.USER_NOT_FOUND,
            applicationMessage: "You have attempted to perform an action against a user that doesn't exist."
          })
        }

        throw e
      }

      if (!targetUser.verifiedAt) {
        throw new UserRequestError({
          identifier: ErrorIdentifiers.AUTH_NOT_VERIFIED,
          applicationMessage: "You have attempted to perform an action against an unverified user."
        });
      }
    }

    return
  }

  /**
   * Get the permissions associated with the given role.
   * This function includes resolving all inherited permissions too.
   *
   * @param role
   */
  static resolveRolePermissions(role: Roles): Permissions[] {
    const permissionProfile = RolePermissions[role]
    let permissions = permissionProfile.permissions

    if (permissionProfile.inherit) {
      permissions = permissions.concat(AuthService.resolveRolePermissions(permissionProfile.inherit))
    }

    return permissions
  }

  async requestEmailVerification(userId: string) {
    const user = await this.usersService._UNSAFE_get(userId)
    if (user.verifiedAt) {
      throw new UserRequestError({
        identifier: ErrorIdentifiers.AUTH_NOT_VERIFIED,
        applicationMessage: "The given account has already been verified."
      })
    }

    const verificationToken = await this.tokenService.getActionToken({
      userId: user.id,
      actionType: "verify-email",
      secret: this.configService.config.auth.emailVerification.secret,
      expiry: this.configService.config.auth.emailVerification.expiry
    })

    const verificationUrl = `${this.configService.config.auth.emailVerification.url}#${verificationToken}`

    await this.emailService.sendEmail({
      to: user.email,
      subject: `Account verification for ${this.configService.config.general.applicationName}`,
      message: `To verify your account you can follow this link: ${verificationUrl}`,
    })
  }

  async verifyEmail(userContext: UserContext, actionToken: string): Promise<AuthUserResponse> {
    const user = await this.usersService._UNSAFE_get(userContext.id)

    if (user.verifiedAt) {
      throw new UserRequestError({
        identifier: ErrorIdentifiers.AUTH_NOT_VERIFIED,
        applicationMessage: "The given account has already been verified."
      })
    }

    const tokenPayload = await this.tokenService.validateAndDecodeActionToken(actionToken, this.configService.config.auth.emailVerification.secret)
    if (!tokenPayload) {
      throw new UserRequestError({
        identifier: ErrorIdentifiers.AUTH_TOKEN_INVALID,
        applicationMessage: "The supplied token is invalid."
      })
    }

    if (tokenPayload.sub !== userContext.id) {
      throw new AccessForbiddenError({
        identifier: ErrorIdentifiers.AUTH_NOT_VERIFIED,
        applicationMessage: "The supplied token subject does not match the account requesting the verification."
      })
    }

    const updatedUser = await this.usersService.verifyUser(user)
    const tokenPair = await this.tokenService.createNewTokenPair(updatedUser)

    return {
      user: updatedUser,
      tokens: tokenPair
    }
  }
}

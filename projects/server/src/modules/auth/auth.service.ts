import {Injectable} from "@nestjs/common";
import {UsersService} from "../users/users.service.js";
import {TokenService} from "../../services/token/token.service.js";
import {LoginResponse, TokenPair, ErrorIdentifiers} from "@localful/common";
import {PasswordService} from "../../services/password/password.service.js";
import {AccessForbiddenError} from "../../services/errors/access/access-forbidden.error.js";
import {AccessUnauthorizedError} from "../../services/errors/access/access-unauthorized.error.js";
import {UserRequestError} from "../../services/errors/base/user-request.error.js";
import {DatabaseUserDto} from "../users/database/database-user.js";
import {AccessControlOptions} from "./auth.guards.js";


@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private tokenService: TokenService
  ) {}

  async login(email: string, password: string): Promise<LoginResponse> {
    let databaseUserDto: DatabaseUserDto;

    try {
      databaseUserDto = await this.usersService.getWithPasswordByEmail(email);
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

    const userDto = this.usersService.removePasswordFromUser(databaseUserDto);
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
    const userDto = await this.usersService.get(tokenPayload.sub);

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
    for (const userPermission of options.userScopedPermissions) {
      if (
        options.requestingUserContext?.permissions.includes(userPermission) &&
        options.requestingUserContext.id === options.targetUserId
      ) {
        return;
      }
    }
    for (const globalPermission of options.globalScopedPermissions) {
      if (
        options.requestingUserContext?.permissions.includes(globalPermission)
      ) {
        return;
      }
    }

    throw new AccessForbiddenError({
      applicationMessage: "You do not have the permissions required to perform this action."
    });
  }
}

import {Injectable} from "@nestjs/common";
import {UsersService} from "../users/users.service";
import {TokenService} from "../../services/token/token.service";
import {LoginResponse, DatabaseUserDto, RefreshResponse, ErrorIdentifiers} from "@localful/common";
import {PasswordService} from "../../services/password/password.service";
import {AccessForbiddenError} from "../../services/errors/access/access-forbidden.error";
import {AccessUnauthorizedError} from "../../services/errors/access/access-unauthorized.error";
import {UserRequestError} from "../../services/errors/base/user-request.error";


@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private tokenService: TokenService
  ) {}

  async login(username: string, password: string): Promise<LoginResponse> {
    let user: DatabaseUserDto;

    try {
       user = await this.usersService.getWithPasswordByUsername(username);
    }
    catch (e) {
       throw new AccessForbiddenError({
         identifier: ErrorIdentifiers.AUTH_CREDENTIALS_INVALID,
         message: "The supplied username & password combination is invalid.",
         applicationMessage: "The supplied username & password combination is invalid."
       });
    }

    const passwordValid = await PasswordService.checkPassword(password, user.passwordHash);
    if (!passwordValid) {
      throw new AccessForbiddenError({
       identifier: ErrorIdentifiers.AUTH_CREDENTIALS_INVALID,
       message: "The supplied username & password combination is invalid.",
       applicationMessage: "The supplied username & password combination is invalid."
     });
    }

    const userDto = this.usersService.removePasswordFromUser(user);
    const tokens = await this.tokenService.createNewTokenPair(user);

    return {
      user: userDto,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken
    }
  }

  async refresh(refreshToken: string): Promise<RefreshResponse> {
    const tokenPayload = await this.tokenService.validateAndDecodeRefreshToken(refreshToken);

    if (!tokenPayload) {
      throw new AccessUnauthorizedError({
        identifier: ErrorIdentifiers.AUTH_TOKEN_INVALID,
        message: "The supplied refresh token is invalid.",
        applicationMessage: "The supplied refresh token is invalid."
      });
    }

    // As the token has been validated the supplied userId/sub value in the token can in theory trusted
    // If the user isn't found, the user service will throw an error.
    // todo: the user service throwing an error not returning null makes the error handling here unclear.
    const userDto = await this.usersService.get(tokenPayload.sub);

    return await this.tokenService.getRefreshedTokenPair(userDto, tokenPayload.gid);
  }

  async logout(refreshToken: string) {
    const payload = await this.tokenService.validateAndDecodeRefreshToken(refreshToken);

    if (!payload) {
      throw new UserRequestError({
        identifier: ErrorIdentifiers.AUTH_TOKEN_INVALID,
        applicationMessage: "The refresh token supplied is either invalid or already expired."
      });
    }

    await this.tokenService.blacklistTokenGroup(payload.gid, payload.exp);
  }
}

import {Injectable} from "@nestjs/common";
import {UsersService} from "../users/users.service";
import {TokenService} from "../../services/token/token.service";
import {LoginResponse, DatabaseUserDto, RefreshResponse, ErrorIdentifiers} from "@ben-ryder/lfb-common";
import {PasswordService} from "../../services/password/password.service";
import {AccessForbiddenError} from "../../services/errors/access/access-forbidden.error";
import {AccessUnauthorizedError} from "../../services/errors/access/access-unauthorized.error";


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
    const tokenPair = this.tokenService.createTokenPair(user);

    return {
     user: userDto,
     ...tokenPair
    };
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

    // As the token has been validated the supplied userId in the token can be trusted
    const userDto = await this.usersService.get(tokenPayload.userId);
    return this.tokenService.createTokenPair(userDto);
  }
}

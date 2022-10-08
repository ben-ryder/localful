import {ConfigService} from "../../services/config/config";
import {UsersService} from "./users.service";
import {TokenService} from "../../services/token/token.service";
import {Body, Controller, Delete, Get, Param, Patch, Post, UseGuards} from "@nestjs/common";
import {CreateUserRequest} from "../../common/schemas/users/request/create.users.request";
import {AccessForbiddenError} from "../../common/errors/access/access-forbidden.error";
import {ErrorIdentifiers} from "../../common/errors/error-identifiers";
import {UsersURLParams} from "../../common/schemas/users/request/url-params.users.request";
import {RequestContext} from "../../common/request-context.decorator";
import {UpdateUserRequest} from "../../common/schemas/users/request/update.users.request";
import {ZodValidationPipe} from "../../common/schemas/zod-validation.pipe";
import {AuthGuard} from "../auth/auth.guard";


@Controller({
  path: "/users",
  version: "1"
})
export class UsersController {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
    private tokenService: TokenService
  ) {}

  @Post()
  async add(
    @Body(new ZodValidationPipe(CreateUserRequest)) createUserRequest: CreateUserRequest
  ) {
    if (!this.configService.config.app.registrationEnabled) {
      throw new AccessForbiddenError({
        identifier: ErrorIdentifiers.USER_REGISTRATION_DISABLED,
        applicationMessage: "User registration is currently disabled."
      })
    }

    const newUser = await this.usersService.add(createUserRequest);
    const tokens = await this.tokenService.createTokenPair(newUser);

    return {
      user: newUser,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken
    };
  }

  @Get("/:userId")
  @UseGuards(AuthGuard)
  async get(@Param(new ZodValidationPipe(UsersURLParams)) params: UsersURLParams, @RequestContext() context: RequestContext) {
    return await this.usersService.getWithAccessCheck(context.user.id, params.userId);
  }

  @Patch("/:userId")
  @UseGuards(AuthGuard)
  async update(
    @Param(new ZodValidationPipe(UsersURLParams)) params: UsersURLParams,
    @Body(new ZodValidationPipe(UpdateUserRequest)) updateUserRequest: UpdateUserRequest,
    @RequestContext() context: RequestContext
  ) {
    return await this.usersService.updateWithAccessCheck(context.user.id, params.userId, updateUserRequest);
  }

  @Delete("/:userId")
  @UseGuards(AuthGuard)
  async delete(
    @Param(new ZodValidationPipe(UsersURLParams)) params: UsersURLParams,
    @RequestContext() context: RequestContext
  ) {
    return await this.usersService.deleteWithAccessCheck(context.user.id, params.userId);
  }
}

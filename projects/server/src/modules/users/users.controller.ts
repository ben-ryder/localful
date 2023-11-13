import {ConfigService} from "../../services/config/config";
import {UsersService} from "./users.service";
import {TokenService} from "../../services/token/token.service";
import {Body, Controller, Delete, Get, Param, Patch, Post, UseGuards} from "@nestjs/common";
import {CreateUserRequest, UsersURLParams, UpdateUserRequest} from "@localful/common";
import {ErrorIdentifiers} from "@localful/common";
import {RequestContext} from "../../common/request-context.decorator";
import {AuthGuard} from "../auth/auth.guards";
import {AccessForbiddenError} from "../../services/errors/access/access-forbidden.error";
import {ZodValidationPipe} from "../../common/zod-validation.pipe";


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
    const tokens = await this.tokenService.createNewTokenPair(newUser);

    return {
      user: newUser,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken
    };
  }

  @Get("/:userId")
  @UseGuards(AuthGuard)
  async get(@Param(new ZodValidationPipe(UsersURLParams)) params: UsersURLParams, @RequestContext() context: RequestContext) {
    return await this.usersService.getWithAccessCheck(context.user, params.userId);
  }

  @Patch("/:userId")
  @UseGuards(AuthGuard)
  async update(
    @Param(new ZodValidationPipe(UsersURLParams)) params: UsersURLParams,
    @Body(new ZodValidationPipe(UpdateUserRequest)) updateUserRequest: UpdateUserRequest,
    @RequestContext() context: RequestContext
  ) {
    return await this.usersService.updateWithAccessCheck(context.user, params.userId, updateUserRequest);
  }

  @Delete("/:userId")
  @UseGuards(AuthGuard)
  async delete(
    @Param(new ZodValidationPipe(UsersURLParams)) params: UsersURLParams,
    @RequestContext() context: RequestContext
  ) {
    return await this.usersService.deleteWithAccessCheck(context.user, params.userId);
  }
}

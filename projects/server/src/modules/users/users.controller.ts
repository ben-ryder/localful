import {ConfigService} from "../../services/config/config.js";
import {UsersService} from "./users.service.js";
import {TokenService} from "../../services/token/token.service.js";
import {Body, Controller, Delete, Get, Param, Patch, Post, UseGuards} from "@nestjs/common";
import {CreateUserDto, UsersURLParams, UpdateUserDto} from "@localful/common";
import {ErrorIdentifiers} from "@localful/common";
import {RequestContext} from "../../common/request-context.decorator.js";
import {AuthGuard} from "../auth/auth.guards.js";
import {AccessForbiddenError} from "../../services/errors/access/access-forbidden.error.js";
import {ZodValidationPipe} from "../../common/zod-validation.pipe.js";


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
    @Body(new ZodValidationPipe(CreateUserDto)) createUserDto: CreateUserDto
  ) {
    if (!this.configService.config.app.registrationEnabled) {
      throw new AccessForbiddenError({
        identifier: ErrorIdentifiers.USER_REGISTRATION_DISABLED,
        applicationMessage: "User registration is currently disabled."
      })
    }

    const newUser = await this.usersService.add(createUserDto);
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
    @Body(new ZodValidationPipe(UpdateUserDto)) updateUserDto: UpdateUserDto,
    @RequestContext() context: RequestContext
  ) {
    return await this.usersService.updateWithAccessCheck(context.user, params.userId, updateUserDto);
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

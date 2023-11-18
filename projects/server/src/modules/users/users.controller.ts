import {ConfigService} from "../../services/config/config";
import {UsersService} from "./users.service";
import {TokenService} from "../../services/token/token.service";
import {Body, Controller, Delete, Get, Param, Patch, Post, UseGuards} from "@nestjs/common";
import {CreateUserDto, UsersURLParams, UpdateUserDto} from "@localful/common";
import {RequestContext} from "../../common/request-context.decorator";
import {AuthGuard} from "../auth/auth.guards";
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
    @Body(new ZodValidationPipe(CreateUserDto)) createUserDto: CreateUserDto
  ) {
    // Access control and registration enabled checks are done within the service.
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
    return await this.usersService.get(context.user, params.userId);
  }

  @Patch("/:userId")
  @UseGuards(AuthGuard)
  async update(
    @Param(new ZodValidationPipe(UsersURLParams)) params: UsersURLParams,
    @Body(new ZodValidationPipe(UpdateUserDto)) updateUserDto: UpdateUserDto,
    @RequestContext() context: RequestContext
  ) {
    return await this.usersService.update(context.user, params.userId, updateUserDto);
  }

  @Delete("/:userId")
  @UseGuards(AuthGuard)
  async delete(
    @Param(new ZodValidationPipe(UsersURLParams)) params: UsersURLParams,
    @RequestContext() context: RequestContext
  ) {
    return await this.usersService.delete(context.user, params.userId);
  }
}

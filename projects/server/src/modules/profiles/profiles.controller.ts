import {Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, UseGuards, UsePipes} from "@nestjs/common";
import {ProfileURLParams, UpdateProfileRequest} from "@ben-ryder/lfb-common";
import {RequestContext} from "../../common/request-context.decorator";
//import {AuthGuard} from "../auth/auth.guard";
import {ProfilesService} from "./profiles.service";
import {ZodValidationPipe} from "@anatine/zod-nestjs";


@Controller({
  path: "/:userId/profile",
  version: "1"
})
//@UseGuards(AuthGuard)
@UsePipes(ZodValidationPipe)
export class ProfilesController {
  constructor(
    private profilesService: ProfilesService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async upsert(
    @Param() params: ProfileURLParams,
    @Body() profile: UpdateProfileRequest,
    @RequestContext() context: RequestContext
  ) {
    return await this.profilesService.upsert(context.user, params.userId, profile.data);
  }

  @Get()
  async get(
    @Param() params: ProfileURLParams,
    @RequestContext() context: RequestContext,
  ) {
    return await this.profilesService.get(context.user, params.userId);
  }

  @Delete()
  async delete(
    @Param() params: ProfileURLParams,
    @RequestContext() context: RequestContext,
  ) {
    return await this.profilesService.delete(context.user, params.userId);
  }
}

import {Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, UseGuards} from "@nestjs/common";
import {ProfileURLParams, UpdateProfileRequest} from "@ben-ryder/lfb-common";
import {RequestContext} from "../../common/request-context.decorator";
//import {AuthGuard} from "../auth/auth.guard";
import {ZodValidationPipe} from "../../common/zod-validation.pipe";
import {ProfilesService} from "./profiles.service";


@Controller({
  path: "/:userId/profile",
  version: "1"
})
//@UseGuards(AuthGuard)
export class ProfilesController {
  constructor(
    private profilesService: ProfilesService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async upsert(
    @Param(new ZodValidationPipe(ProfileURLParams)) params: ProfileURLParams,
    @Body(new ZodValidationPipe(UpdateProfileRequest)) profile: UpdateProfileRequest,
    @RequestContext() context: RequestContext
  ) {
    return await this.profilesService.upsert(context.user, params.userId, profile);
  }

  @Get()
  async get(
    @Param(new ZodValidationPipe(ProfileURLParams)) params: ProfileURLParams,
    @RequestContext() context: RequestContext,
  ) {
    return await this.profilesService.get(context.user, params.userId);
  }

  @Delete()
  async delete(
    @Param(new ZodValidationPipe(ProfileURLParams)) params: ProfileURLParams,
    @RequestContext() context: RequestContext,
  ) {
    return await this.profilesService.delete(context.user, params.userId);
  }
}

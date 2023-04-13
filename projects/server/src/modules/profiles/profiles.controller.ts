import {ConfigService} from "../../services/config/config";
import {ProfilesService} from "./profiles.service";
import {Body, Controller, Delete, Get, Param, Patch, Post, UseGuards} from "@nestjs/common";
import {ProfileCreateDto, ProfilesURLParams, ProfileUpdateDto} from "@ben-ryder/lfb-common";
import {RequestContext} from "../../common/request-context.decorator";
import {ZodValidationPipe} from "../../common/zod-validation.pipe";
import {AuthGuard} from "../../services/auth/auth.guard";


@Controller({
  path: "/profiles",
  version: "1"
})
@UseGuards(AuthGuard)
export class ProfilesController {
  constructor(
    private configService: ConfigService,
    private profilesService: ProfilesService
  ) {}

  @Post()
  async create(
    @Body(new ZodValidationPipe(ProfileCreateDto)) profileCreateDto: ProfileCreateDto,
    @RequestContext() context: RequestContext
  ) {
    return await this.profilesService.createWithAccessCheck(context.user, profileCreateDto);
  }

  @Get("/:userId")
  async get(
    @Param(new ZodValidationPipe(ProfilesURLParams)) params: ProfilesURLParams,
    @RequestContext() context: RequestContext
  ) {
    return await this.profilesService.getWithAccessCheck(context.user, params.userId);
  }

  @Patch("/:userId")
  async update(
    @Param(new ZodValidationPipe(ProfilesURLParams)) params: ProfilesURLParams,
    @Body(new ZodValidationPipe(ProfileUpdateDto)) profileUpdateDto: ProfileUpdateDto,
    @RequestContext() context: RequestContext
  ) {
    return await this.profilesService.updateWithAccessCheck(context.user, params.userId, profileUpdateDto);
  }

  @Delete("/:userId")
  async delete(
    @Param(new ZodValidationPipe(ProfilesURLParams)) params: ProfilesURLParams,
    @RequestContext() context: RequestContext
  ) {
    return await this.profilesService.deleteWithAccessCheck(context.user, params.userId);
  }
}

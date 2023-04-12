import {ConfigService} from "../../services/config/config";
import {ProfilesService} from "./profiles.service";
import {Body, Controller, Delete, Get, Param, Patch, Post, UseGuards} from "@nestjs/common";
import {ProfileCreateDto, ProfilesURLParams, ProfileUpdateDto} from "@ben-ryder/lfb-common";
import {RequestContext} from "../../common/request-context.decorator";
import {ZodValidationPipe} from "../../common/zod-validation.pipe";
import {AuthGuard} from "../../services/auth/auth.guard";
import {UseAccessControl} from "../../services/auth/auth.service";


@Controller({
  path: "/users",
  version: "1"
})
@UseGuards(AuthGuard)
export class ProfilesController {
  constructor(
    private configService: ConfigService,
    private profilesService: ProfilesService
  ) {}

  @Post()
  @UseAccessControl({
    scopes: ["profiles:create:self"]
  })
  async add(
    @Body(new ZodValidationPipe(ProfileCreateDto)) profileCreateDto: ProfileCreateDto
  ) {
    return await this.profilesService.createWithAccessCheck( profileCreateDto);
  }

  @Get("/:userId")
  @UseAccessControl({
    scopes: ["profiles:retrieve:self"]
  })
  async get(
    @Param(new ZodValidationPipe(ProfilesURLParams)) params: ProfilesURLParams,
    @RequestContext() context: RequestContext
  ) {
    return await this.profilesService.getWithAccessCheck(context.user, params.userId);
  }

  @Patch("/:userId")
  @UseAccessControl({
    scopes: ["profiles:update:self"]
  })
  async update(
    @Param(new ZodValidationPipe(ProfilesURLParams)) params: ProfilesURLParams,
    @Body(new ZodValidationPipe(UpdateProfileRequest)) updateProfileRequest: UpdateProfileRequest,
    @RequestContext() context: RequestContext
  ) {
    return await this.profilesService.updateWithAccessCheck(context.user, params.userId, updateProfileRequest);
  }

  @Delete("/:userId")
  @UseAccessControl({
    scopes: ["profiles:delete:self"]
  })
  async delete(
    @Param(new ZodValidationPipe(ProfilesURLParams)) params: ProfilesURLParams,
    @RequestContext() context: RequestContext
  ) {
    return await this.profilesService.deleteWithAccessCheck(context.user, params.userId);
  }
}

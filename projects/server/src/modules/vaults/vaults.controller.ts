import {ConfigService} from "../../services/config/config";
import {VaultsService} from "./vaults.service";
import {Body, Controller, Delete, Get, Param, Patch, Post, UseGuards} from "@nestjs/common";
import {RequestContext} from "../../common/request-context.decorator";
import {ZodValidationPipe} from "../../common/zod-validation.pipe";
import {createAuthGuard} from "../auth/auth.guards";
import {CreateVaultDto, UpdateVaultDto, VaultsURLParams} from "@localful/common";

@Controller({
  path: "/vaults",
  version: "1"
})
@UseGuards(createAuthGuard())
export class VaultsController {
  constructor(
    private configService: ConfigService,
    private vaultsService: VaultsService
  ) {}

  @Post()
  async create(
    @Body(new ZodValidationPipe(CreateVaultDto)) profileCreateDto: CreateVaultDto,
    @RequestContext() context: RequestContext
  ) {
    return await this.vaultsService.create(context.user, profileCreateDto);
  }

  @Get("/:vaultId")
  async get(
    @Param(new ZodValidationPipe(VaultsURLParams)) params: VaultsURLParams,
    @RequestContext() context: RequestContext
  ) {
    return await this.vaultsService.get(context.user, params.vaultId);
  }

  @Patch("/:vaultId")
  async update(
    @Param(new ZodValidationPipe(VaultsURLParams)) params: VaultsURLParams,
    @Body(new ZodValidationPipe(UpdateVaultDto)) profileUpdateDto: UpdateVaultDto,
    @RequestContext() context: RequestContext
  ) {
    return await this.vaultsService.update(context.user, params.vaultId, profileUpdateDto);
  }

  @Delete("/:vaultId")
  async delete(
    @Param(new ZodValidationPipe(VaultsURLParams)) params: VaultsURLParams,
    @RequestContext() context: RequestContext
  ) {
    return await this.vaultsService.delete(context.user, params.vaultId);
  }
}

import {Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Query, UseGuards} from "@nestjs/common";
import {ChangesService} from "./changes.service.js";
import {CreateChangesDto, ChangesQueryParams, ChangesURLParams} from "@localful/common";
import {RequestContext} from "../../common/request-context.decorator.js";
import {ZodValidationPipe} from "../../common/zod-validation.pipe.js";
import {AuthGuard} from "../auth/auth.guards.js";

@Controller({
  path: "/changes/:userId",
  version: "1"
})
@UseGuards(AuthGuard)
export class ChangesController {
  constructor(
    private changesService: ChangesService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async create(
    @Param(new ZodValidationPipe(ChangesURLParams)) urlParams: ChangesURLParams,
    @Body(new ZodValidationPipe(CreateChangesDto)) createChangesDto: CreateChangesDto,
    @RequestContext() context: RequestContext
  ) {
    return await this.changesService.createMany(context?.user, urlParams.resourceId, createChangesDto);
  }

  @Get()
  async list(
    @Param(new ZodValidationPipe(ChangesURLParams)) urlParams: ChangesURLParams,
    @RequestContext() context: RequestContext,
    @Query() queryParams: ChangesQueryParams
  ) {
    return await this.changesService.list(context?.user, urlParams.resourceId, queryParams);
  }

  @Delete()
  async deleteChanges(
    @Param(new ZodValidationPipe(ChangesURLParams)) urlParams: ChangesURLParams,
    @RequestContext() context: RequestContext,
  ) {
    return await this.changesService.delete(context?.user, urlParams.resourceId);
  }
}

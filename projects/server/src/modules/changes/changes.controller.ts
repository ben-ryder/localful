import {Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Query, UseGuards} from "@nestjs/common";
import {ChangesService} from "./changes.service.js";
import {ChangeCreateDto, ChangesRetrieveQueryParams, ChangesURLParams} from "@localful/common";
import {RequestContext} from "../../common/request-context.decorator.js";
import {ZodValidationPipe} from "../../common/zod-validation.pipe.js";
import {AuthGuard} from "../../services/auth/auth.guard.js";

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
    @Param(new ZodValidationPipe(ChangesURLParams)) params: ChangesURLParams,
    @Body(new ZodValidationPipe(ChangeCreateDto)) newChanges: ChangeCreateDto,
    @RequestContext() context: RequestContext
  ) {
    return await this.changesService.createWithAccessCheck(context?.user, params.userId, newChanges);
  }

  @Get()
  async list(
    @Param(new ZodValidationPipe(ChangesURLParams)) params: ChangesURLParams,
    @RequestContext() context: RequestContext,
    @Query() query: ChangesRetrieveQueryParams
  ) {
    return await this.changesService.listWithAccessCheck(context?.user, params.userId, query.ids);
  }

  @Get("/ids")
  async listIds(
    @Param(new ZodValidationPipe(ChangesURLParams)) params: ChangesURLParams,
    @RequestContext() context: RequestContext,
  ) {
    return await this.changesService.getIdsWithAccessCheck(context?.user, params.userId);
  }

  @Delete()
  async deleteChanges(
    @Param(new ZodValidationPipe(ChangesURLParams)) params: ChangesURLParams,
    @RequestContext() context: RequestContext,
  ) {
    return await this.changesService.deleteAllWithAccessCheck(context?.user, params.userId);
  }
}

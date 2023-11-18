import {Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Query, UseGuards} from "@nestjs/common";
import {ChangesService} from "./changes.service";
import {ChangeDtoList, ChangesQueryParams, ChangesURLParams} from "@localful/common";
import {RequestContext} from "../../common/request-context.decorator";
import {ZodValidationPipe} from "../../common/zod-validation.pipe";
import {AuthGuard} from "../auth/auth.guards";

@Controller({
  path: "/resources/:resourceId/changes",
  version: "1"
})
@UseGuards(AuthGuard)
export class ChangesController {
  constructor(
    private changesService: ChangesService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async createMany(
    @Param(new ZodValidationPipe(ChangesURLParams)) urlParams: ChangesURLParams,
    @Body(new ZodValidationPipe(ChangeDtoList)) changeDtoList: ChangeDtoList,
    @RequestContext() context: RequestContext
  ) {
    return await this.changesService.createMany(context?.user, urlParams.resourceId, changeDtoList);
  }

  @Get()
  async list(
    @Param(new ZodValidationPipe(ChangesURLParams)) urlParams: ChangesURLParams,
    @RequestContext() context: RequestContext,
    @Query() queryParams: ChangesQueryParams
  ) {
    return await this.changesService.list(context?.user, urlParams.resourceId, queryParams);
  }
}

import {Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Query, UseGuards} from "@nestjs/common";
import {ChangesService} from "./changes.service";
import {AddChangesRequest, GetChangesQueryParams, ChangesURLParams} from "@ben-ryder/lfb-common";
import {RequestContext} from "../../common/request-context.decorator";
//import {AuthGuard} from "../auth/auth.guard";
import {ZodValidationPipe} from "../../common/zod-validation.pipe";;


@Controller({
  path: "/:userId/changes",
  version: "1"
})
//@UseGuards(AuthGuard)
export class ChangesController {
  constructor(
    private changesService: ChangesService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async add(
    @Param(new ZodValidationPipe(ChangesURLParams)) params: ChangesURLParams,
    @Body(new ZodValidationPipe(AddChangesRequest)) newChanges: AddChangesRequest,
    @RequestContext() context: RequestContext
  ) {
    return await this.changesService.add(context.user, params.userId, newChanges);
  }

  @Get()
  async list(
    @Param(new ZodValidationPipe(ChangesURLParams)) params: ChangesURLParams,
    @RequestContext() context: RequestContext,
    @Query(new ZodValidationPipe(GetChangesQueryParams)) query: GetChangesQueryParams
  ) {
    return await this.changesService.list(context.user, params.userId, query.ids);
  }

  @Get("/ids")
  async listIds(
    @Param(new ZodValidationPipe(ChangesURLParams)) params: ChangesURLParams,
    @RequestContext() context: RequestContext,
  ) {
    return await this.changesService.getIds(context.user, params.userId);
  }
}

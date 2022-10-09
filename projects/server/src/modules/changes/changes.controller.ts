import {Body, Controller, Get, HttpCode, HttpStatus, Param, Post, UseGuards} from "@nestjs/common";
import {ChangesService} from "./changes.service";
import {ZodValidationPipe} from "../../common/schemas/zod-validation.pipe";
import {AddChangesRequest} from "../../common/schemas/changes/request/add.changes.request";
import {RequestContext} from "../../common/request-context.decorator";
import {AuthGuard} from "../auth/auth.guard";
import {GetChangesQueryParams} from "../../common/schemas/changes/request/url-params.get.changes.request";


@Controller({
  path: "/changes",
  version: "1"
})
export class ChangesController {
  constructor(
    private changesService: ChangesService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  async add(
    @Body(new ZodValidationPipe(AddChangesRequest)) newChanges: AddChangesRequest,
    @RequestContext() context: RequestContext
  ) {
    return await this.changesService.add(context.user.id, newChanges);
  }

  @Get()
  @UseGuards(AuthGuard)
  async list(
    @RequestContext() context: RequestContext,
    @Param(new ZodValidationPipe(GetChangesQueryParams)) params: GetChangesQueryParams
  ) {
    return await this.changesService.list(context.user.id, params.ids);
  }

  @Get("/ids")
  @UseGuards(AuthGuard)
  async listIds(
    @RequestContext() context: RequestContext,
  ) {
    return await this.changesService.getIds(context.user.id);
  }
}

import {Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Query, UseGuards, UsePipes} from "@nestjs/common";
import {ChangesService} from "./changes.service";
import {AddChangesRequest, GetChangesQueryParams, ChangesURLParams} from "@ben-ryder/lfb-common";
import {RequestContext} from "../../common/request-context.decorator";
//import {AuthGuard} from "../auth/auth.guard";
import { ZodValidationPipe } from "@anatine/zod-nestjs";


@Controller({
  path: "/:userId/changes",
  version: "1"
})
//@UseGuards(AuthGuard)
@UsePipes(ZodValidationPipe)
export class ChangesController {
  constructor(
    private changesService: ChangesService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async add(
    @Param() params: ChangesURLParams,
    @Body() newChanges: AddChangesRequest,
    @RequestContext() context: RequestContext
  ) {
    return await this.changesService.add(context?.user, params.userId, newChanges);
  }

  @Get()
  async list(
    @Param() params: ChangesURLParams,
    @RequestContext() context: RequestContext,
    @Query() query: GetChangesQueryParams
  ) {
    return await this.changesService.list(context?.user, params.userId, query.ids);
  }

  @Get("/ids")
  async listIds(
    @Param() params: ChangesURLParams,
    @RequestContext() context: RequestContext,
  ) {
    return await this.changesService.getIds(context?.user, params.userId);
  }
}

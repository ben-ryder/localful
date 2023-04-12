import {Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Query, Res, UseGuards} from "@nestjs/common";
import {ChangesService} from "./changes.service";
import {ChangeCreateDto, ChangesRetrieveQueryParams, ChangesURLParams} from "@ben-ryder/lfb-common";
import {RequestContext} from "../../common/request-context.decorator";
import {ZodValidationPipe} from "../../common/zod-validation.pipe";
import {AuthGuard} from "../../services/auth/auth.guard";
import { Response } from "express";

@Controller({
  path: "/:userId/changes",
  version: "1"
})
@UseGuards(AuthGuard)
export class ChangesController {
  constructor(
    private changesService: ChangesService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async add(
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
    @Res() res: Response
  ) {
    // todo: implement this endpoint
    return res.status(501).send({
      statusCode: 501,
      message: "Not Implemented Yet"
    })
  }
}

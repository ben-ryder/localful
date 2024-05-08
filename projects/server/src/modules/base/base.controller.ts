import {All, Controller, Get, HttpStatus, Res} from "@nestjs/common";
import {Response} from "express";
import {ErrorIdentifiers} from "@localful/common";

@Controller("/")
export class BaseController {
  getWelcomeMessage() {
    return {
      message: "Welcome to the Localful server. For docs see https://github.com/ben-ryder/localful."
    };
  }

  @Get()
  base() {
    return this.getWelcomeMessage();
  }

  @Get("/v1")
  baseV1() {
    return this.getWelcomeMessage();
  }

  @All()
  async routeNotFound(
    @Res() res: Response
  ) {
    return res.status(HttpStatus.NOT_FOUND).send({
      statusCode: HttpStatus.NOT_FOUND,
      identifier: ErrorIdentifiers.RESOURCE_NOT_FOUND,
      message: "The route you requested could not be found.",
    })
  }
}

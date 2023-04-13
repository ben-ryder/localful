import { Controller, Get } from "@nestjs/common";

@Controller("/")
export class BaseController {
  getWelcomeMessage() {
    return {
      message: "Welcome to the Local-First Server API. For docs see https://github.com/ben-ryder/local-first-server."
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
}

import { Controller, Get } from "@nestjs/common";

@Controller("/")
export class BaseController {
  getWelcomeMessage() {
    return {
      message: "Welcome to the Local-first backend API. For docs see https://github.com/Ben-Ryder/local-first-backend."
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

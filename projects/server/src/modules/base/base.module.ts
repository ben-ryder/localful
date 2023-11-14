import { Module } from "@nestjs/common";
import { BaseController } from "./base.controller.js";

@Module({
  controllers: [BaseController],
  providers: [],
})
export class BaseModule {}

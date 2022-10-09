import { Module } from "@nestjs/common";
import {ChangesService} from "./changes.service";
import {ChangesController} from "./changes.controller";


@Module({
  controllers: [ChangesController],
  providers: [ChangesService],
})
export class ChangesModule {}

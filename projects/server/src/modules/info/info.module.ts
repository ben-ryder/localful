import { Module } from "@nestjs/common";
import { InfoController } from "./info.controller.js";
import {ServicesModule} from "../../services/services.module.js";


@Module({
  imports: [ServicesModule],
  controllers: [InfoController],
  providers: [],
})
export class InfoModule {}

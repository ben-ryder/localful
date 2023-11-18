import { Module } from "@nestjs/common";
import { InfoController } from "./info.controller";
import {ServicesModule} from "../../services/services.module";


@Module({
  imports: [ServicesModule],
  controllers: [InfoController],
  providers: [],
})
export class InfoModule {}

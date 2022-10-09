import { Module } from "@nestjs/common";
import {ChangesService} from "./changes.service";
import {ChangesController} from "./changes.controller";
import {ChangesGateway} from "./changes.gateway";
import {ServicesModule} from "../../services/services.module";
import {ChangesDatabaseService} from "./database/changes.database.service";


@Module({
  imports: [ServicesModule],
  controllers: [ChangesController],
  providers: [
    ChangesService,
    ChangesDatabaseService,
    ChangesGateway
  ],
  exports: []
})
export class ChangesModule {}

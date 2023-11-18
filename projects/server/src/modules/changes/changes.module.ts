import { Module } from "@nestjs/common";
import {ChangesService} from "./changes.service";
import {ChangesController} from "./changes.controller";
import {ChangesGateway} from "./changes.gateway";
import {ServicesModule} from "../../services/services.module";
import {ChangesDatabaseService} from "./database/changes.database.service";
import {AuthModule} from "../auth/auth.module";


@Module({
  imports: [ServicesModule, AuthModule],
  controllers: [ChangesController],
  providers: [
    ChangesService,
    ChangesDatabaseService,
    ChangesGateway
  ],
  exports: [
    ChangesService
  ]
})
export class ChangesModule {}

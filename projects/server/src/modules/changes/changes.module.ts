import { Module } from "@nestjs/common";
import {ChangesService} from "./changes.service.js";
import {ChangesController} from "./changes.controller.js";
import {ChangesGateway} from "./changes.gateway.js";
import {ServicesModule} from "../../services/services.module.js";
import {ChangesDatabaseService} from "./database/changes.database.service.js";
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

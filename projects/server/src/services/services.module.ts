import { Module } from "@nestjs/common";
import {ConfigService} from "./config/config";
import {DatabaseService} from "./database/database.service";


@Module({
  providers: [
    ConfigService,
    DatabaseService,
  ],
  exports: [
    ConfigService,
    DatabaseService,
  ]
})
export class ServicesModule {}

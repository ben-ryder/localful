import { Module } from "@nestjs/common";
import {ConfigService} from "./config/config.js";
import {DatabaseService} from "./database/database.service.js";
import {AuthService} from "./auth/auth.service.js";


@Module({
  providers: [
    ConfigService,
    DatabaseService,
    AuthService
  ],
  exports: [
    ConfigService,
    DatabaseService,
    AuthService
  ]
})
export class ServicesModule {}

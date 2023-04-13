import { Module } from "@nestjs/common";
import {ConfigService} from "./config/config";
import {DatabaseService} from "./database/database.service";
import {AuthService} from "./auth/auth.service";


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

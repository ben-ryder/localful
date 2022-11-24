import { Module } from "@nestjs/common";
import {ConfigService} from "./config/config";
import {DatabaseService} from "./database/database.service";
import {PasswordService} from "./password/password.service";
import {TokenService} from "./token/token.service";


@Module({
  providers: [
    ConfigService,
    DatabaseService,
    PasswordService,
    TokenService
  ],
  exports: [
    ConfigService,
    DatabaseService,
    PasswordService,
    TokenService
  ]
})
export class ServicesModule {}

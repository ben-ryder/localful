import { Module } from "@nestjs/common";
import {ConfigService} from "./config/config.js";
import {DatabaseService} from "./database/database.service.js";
import {DataStoreService} from "./data-store/data-store.service.js";
import {EmailService} from "./email/email.service.js";
import {PasswordService} from "./password/password.service.js";
import {TokenService} from "./token/token.service.js";


@Module({
  providers: [
    ConfigService,
    DatabaseService,
    DataStoreService,
    EmailService,
    PasswordService,
    TokenService
  ],
  exports: [
    ConfigService,
    DatabaseService,
    DataStoreService,
    EmailService,
    PasswordService,
    TokenService
  ]
})
export class ServicesModule {}

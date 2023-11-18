import { Module } from "@nestjs/common";
import {ConfigService} from "./config/config";
import {DatabaseService} from "./database/database.service";
import {DataStoreService} from "./data-store/data-store.service";
import {EmailService} from "./email/email.service";
import {PasswordService} from "./password/password.service";
import {TokenService} from "./token/token.service";


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

import { Module } from "@nestjs/common";
import {ConfigService} from "./config/config";
import {DatabaseService} from "./database/database.service";
import {PasswordService} from "./password/password.service";
import {TokenService} from "./token/token.service";
import {DataStoreService} from "./data-store/data-store.service";


@Module({
  providers: [
    ConfigService,
    DatabaseService,
    PasswordService,
    TokenService,
    DataStoreService
  ],
  exports: [
    ConfigService,
    DatabaseService,
    PasswordService,
    TokenService,
    DataStoreService
  ]
})
export class ServicesModule {}

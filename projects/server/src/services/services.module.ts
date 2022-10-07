import { Module } from "@nestjs/common";
import {CacheService} from "./cache/cache.service";
import {ConfigService} from "./config/config";
import {DatabaseService} from "./database/database.service";
import {PasswordService} from "./password/password.service";
import {TokenService} from "./token/token.service";


@Module({
  providers: [
    CacheService,
    ConfigService,
    DatabaseService,
    PasswordService,
    TokenService
  ],
  exports: [
    CacheService,
    ConfigService,
    DatabaseService,
    PasswordService,
    TokenService
  ]
})
export class ServicesModule {}

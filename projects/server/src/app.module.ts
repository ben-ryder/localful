import { Module } from "@nestjs/common";
import {BaseModule} from "./modules/base/base.module.js";
import {InfoModule} from "./modules/info/info.module.js";
import {ServicesModule} from "./services/services.module.js";
import {ChangesModule} from "./modules/changes/changes.module.js";
import {UsersModule} from "./modules/users/users.module.js";
import {AuthModule} from "./modules/auth/auth.module.js";

@Module({
  imports: [
    ServicesModule,
    BaseModule,
    InfoModule,
    ChangesModule,
    UsersModule,
    AuthModule
  ],
})
export class AppModule {}

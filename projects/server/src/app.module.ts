import { Module } from "@nestjs/common";
import {BaseModule} from "./modules/base/base.module";
import {InfoModule} from "./modules/info/info.module";
import {ServicesModule} from "./services/services.module";
import {UsersModule} from "./modules/users/users.module";
import {AuthModule} from "./modules/auth/auth.module";

@Module({
  imports: [
    ServicesModule,
    BaseModule,
    InfoModule,
    UsersModule,
    AuthModule
  ],
})
export class AppModule {}

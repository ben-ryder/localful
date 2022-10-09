import { Module } from "@nestjs/common";
import {BaseModule} from "./modules/base/base.module";
import {InfoModule} from "./modules/info/info.module";
import {TestDataModule} from "./modules/test-data/test-data.module";
import {ServicesModule} from "./services/services.module";
import {UsersModule} from "./modules/users/users.module";
import {AuthModule} from "./modules/auth/auth.module";
import {ChangesModule} from "./modules/changes/changes.module";


@Module({
  imports: [
    ServicesModule,
    BaseModule,
    InfoModule,
    TestDataModule,
    UsersModule,
    AuthModule,
    ChangesModule
  ],
})
export class AppModule {}

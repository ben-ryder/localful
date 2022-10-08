import { Module } from "@nestjs/common";
import {BaseModule} from "./modules/base/base.module";
import {InfoModule} from "./modules/info/info.module";
import {TestDataModule} from "./modules/test-data/test-data.module";
import {ServicesModule} from "./services/services.module";
import {UsersModule} from "./modules/users/users.module";


@Module({
  imports: [
    ServicesModule,
    BaseModule,
    InfoModule,
    TestDataModule,
    UsersModule
  ],
})
export class AppModule {}

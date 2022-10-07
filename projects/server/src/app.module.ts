import { Module } from "@nestjs/common";
import {BaseModule} from "./modules/base/base.module";
import {InfoModule} from "./modules/info/info.module";
import {TestingModule} from "./modules/testing/testing.module";
import {ServicesModule} from "./services/services.module";


@Module({
  imports: [
    ServicesModule,
    BaseModule,
    InfoModule,
    TestingModule
  ],
})
export class AppModule {}

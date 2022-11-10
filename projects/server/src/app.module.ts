import { Module } from "@nestjs/common";
import {BaseModule} from "./modules/base/base.module";
import {InfoModule} from "./modules/info/info.module";
import {ServicesModule} from "./services/services.module";
import {ChangesModule} from "./modules/changes/changes.module";


@Module({
  imports: [
    ServicesModule,
    BaseModule,
    InfoModule,
    ChangesModule
  ],
})
export class AppModule {}

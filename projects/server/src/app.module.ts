import { Module } from "@nestjs/common";
import {BaseModule} from "./modules/base/base.module";
import {InfoModule} from "./modules/info/info.module";
import {ServicesModule} from "./services/services.module";
import {ChangesModule} from "./modules/changes/changes.module";
import {ProfilesModule} from "./modules/profiles/profiles.module";


@Module({
  imports: [
    ServicesModule,
    BaseModule,
    InfoModule,
    ChangesModule,
    ProfilesModule
  ],
})
export class AppModule {}

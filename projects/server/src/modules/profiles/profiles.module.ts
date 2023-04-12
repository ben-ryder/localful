import { Module } from "@nestjs/common";
import {ServicesModule} from "../../services/services.module";
import {ProfilesController} from "./profiles.controller";
import {ProfilesService} from "./profiles.service";
import {ProfilesDatabaseService} from "./database/profiles.database.service";


@Module({
  imports: [ServicesModule],
  controllers: [ProfilesController],
  providers: [
    ProfilesService,
    ProfilesDatabaseService
  ],
  exports: [ProfilesService]
})
export class ProfilesModule {}

import { Module } from "@nestjs/common";
import {ServicesModule} from "../../services/services.module";
import {UsersController} from "./users.controller";
import {UsersService} from "./users.service";
import {UsersDatabaseService} from "./database/users.database.service";


@Module({
  imports: [ServicesModule],
  controllers: [UsersController],
  providers: [
    UsersService,
    UsersDatabaseService
  ],
  exports: [UsersService]
})
export class UsersModule {}

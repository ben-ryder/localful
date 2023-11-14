import { Module } from "@nestjs/common";
import {ServicesModule} from "../../services/services.module.js";
import {UsersController} from "./users.controller.js";
import {UsersService} from "./users.service.js";
import {UsersDatabaseService} from "./database/users.database.service.js";


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

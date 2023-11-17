import {forwardRef, Module} from "@nestjs/common";
import {ServicesModule} from "../../services/services.module.js";
import {UsersController} from "./users.controller.js";
import {UsersService} from "./users.service.js";
import {UsersDatabaseService} from "./database/users.database.service.js";
import {AuthModule} from "../auth/auth.module";


@Module({
  imports: [ServicesModule, forwardRef(() => AuthModule)],
  controllers: [UsersController],
  providers: [
    UsersService,
    UsersDatabaseService
  ],
  exports: [UsersService]
})
export class UsersModule {}

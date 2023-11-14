import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller.js";
import {ServicesModule} from "../../services/services.module.js";
import {AuthService} from "./auth.service.js";
import {UsersModule} from "../users/users.module.js";

@Module({
  imports: [ServicesModule, UsersModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}

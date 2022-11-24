import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import {ServicesModule} from "../../services/services.module";
import {AuthService} from "./auth.service";
import {UsersModule} from "../users/users.module";

@Module({
  imports: [ServicesModule, UsersModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}

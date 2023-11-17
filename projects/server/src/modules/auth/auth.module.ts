import {forwardRef, Module} from "@nestjs/common";
import { AuthController } from "./auth.controller.js";
import {ServicesModule} from "../../services/services.module.js";
import {AuthService} from "./auth.service.js";
import {UsersModule} from "../users/users.module";

@Module({
  imports: [ServicesModule, forwardRef(() => UsersModule)],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService]
})
export class AuthModule {}

/**
 * todo: should structure of module change?
 * currently logic is a bit scattered between the guard, service, token service etc
 */

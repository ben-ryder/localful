import {forwardRef, Module} from "@nestjs/common";
import {ServicesModule} from "../../services/services.module";
import {VaultsController} from "./vaults.controller";
import {VaultsService} from "./vaults.service";
import {VaultsDatabaseService} from "./database/vaults.database.service";
import {AuthModule} from "../auth/auth.module";

@Module({
  imports: [ServicesModule, forwardRef(() => AuthModule)],
  controllers: [VaultsController],
  providers: [
    VaultsService,
    VaultsDatabaseService
  ],
  exports: [VaultsService]
})
export class VaultsModule {}

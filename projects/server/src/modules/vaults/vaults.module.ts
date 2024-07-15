import { Module } from "@nestjs/common";
import {ServicesModule} from "../../services/services.module";
import {VaultsController} from "./vaults.controller";
import {VaultsService} from "./vaults.service";
import {VaultsDatabaseService} from "./database/vaults.database.service";

@Module({
  imports: [ServicesModule],
  controllers: [VaultsController],
  providers: [
    VaultsService,
    VaultsDatabaseService
  ],
  exports: [VaultsService]
})
export class VaultsModule {}

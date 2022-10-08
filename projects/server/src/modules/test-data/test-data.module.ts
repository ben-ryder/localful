import { Module } from "@nestjs/common";
import { TestDataController } from "./test-data.controller";
import {ServicesModule} from "../../services/services.module";


@Module({
  imports: [ServicesModule],
  controllers: [TestDataController],
  providers: [],
})
export class TestDataModule {}

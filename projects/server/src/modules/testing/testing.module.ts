import { Module } from "@nestjs/common";
import { TestingController } from "./testing.controller";
import {ServicesModule} from "../../services/services.module";


@Module({
  imports: [ServicesModule],
  controllers: [TestingController],
  providers: [],
})
export class TestingModule {}

import {Controller, Post, UseGuards} from "@nestjs/common";
import { resetTestData } from "../../../tests/e2e/database-scripts";
import {DatabaseService} from "../../services/database/database.service";
import {TestDataGuard} from "./test-data.guard";


@Controller({
  path: "/test-data",
  version: "1"
})
export class TestDataController {
  constructor(
    private databaseService: DatabaseService
  ) {}

  @Post()
  @UseGuards(TestDataGuard)
  async resetTestData() {
    const sql = await this.databaseService.getSQL();
    await resetTestData(sql);
  }
}

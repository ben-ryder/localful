import {Controller, Post, UseGuards} from "@nestjs/common";
import { resetTestData } from "../../../tests/e2e/database-scripts";
import {DatabaseService} from "../../services/database/database.service";
import {TestingGuard} from "./testing.guard";


@Controller({
  path: "/testing",
  version: "1"
})
export class TestingController {
  constructor(
    private databaseService: DatabaseService
  ) {}

  @Post()
  @UseGuards(TestingGuard)
  async resetTestData() {
    const sql = await this.databaseService.getSQL();
    await resetTestData(sql);
  }
}

import postgres, { Sql } from "postgres";

import {ConfigService} from "@services/config/config.service.js";


export class DatabaseService {
  private sql: Sql<any> | null = null;

  constructor(private configService: ConfigService) {}

  async getSQL() {
    if (this.sql) {
      return this.sql;
    }

    this.sql = postgres(this.configService.config.database.url, {
      connection: {
        // This stops timestamps being returned in the server's timezone and leaves
        // timezone conversion upto API clients.
        timezone: "UTC",
      },
    });
    return this.sql;
  }

  async healthCheck() {
    try {
      const sql = await this.getSQL()
      await sql`select 1`
      return true
    }
    catch (error) {
      return false;
    }
  }

  async onModuleDestroy() {
    if (this.sql) {
      await this.sql.end();
    }
  }
}

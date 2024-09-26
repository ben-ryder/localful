import postgres, { Sql } from "postgres";

import {ConfigService} from "@services/config/config.service.js";
import {HealthStatus} from "@modules/health-check/health-check.service.js";


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

  async healthCheck(): Promise<HealthStatus> {
    try {
      const sql = await this.getSQL()
      await sql`select 1`
      return "ok"
    }
    catch (error) {
      return "error";
    }
  }

  async onModuleDestroy() {
    if (this.sql) {
      await this.sql.end();
    }
  }
}

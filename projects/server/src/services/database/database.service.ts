import postgres, { Sql } from "postgres";

import configService, {ConfigService} from "@services/config/config.service.js";


export class DatabaseService {
  private sql: Sql<any> | null = null;

  constructor(private configService: ConfigService) {}

  public async getSQL() {
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

  public async onModuleDestroy() {
    if (this.sql) {
      await this.sql.end();
    }
  }
}

const databaseService = new DatabaseService(configService);
export default databaseService;

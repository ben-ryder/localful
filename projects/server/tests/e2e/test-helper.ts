import {INestApplication} from "@nestjs/common";
import {agent, SuperAgentTest} from "supertest";
import {UserDto} from "@ben-ryder/lfb-common";
import {TokenPair, TokenService} from "../../src/services/token/token.service";
import {DatabaseService} from "../../src/services/database/database.service";
import {clearDatabase, seedTestData} from "./database-scripts";
import {CacheService} from "../../src/services/cache/cache.service";
import {createApp} from "../../src/create-app";


export class TestHelper {
  app: INestApplication;
  client: SuperAgentTest;

  async beforeAll() {
    this.app = await createApp({logger: false})
    await this.app.init();
    const httpServer = this.app.getHttpServer();
    this.client = agent(httpServer);
  }

  /**
   * Return an API access token for the given user
   *
   * @param user
   */
  getUserAccessToken(user: UserDto): string {
    return this.getUserTokens(user).accessToken;
  }

  /**
   * Return an API access token for the given user
   *
   * @param user
   */
  getUserTokens(user: UserDto): TokenPair {
    const tokenService = this.app.get(TokenService);
    return tokenService.createTokenPair(user);
  }

  /**
   * Reset the internal to match the predefined test content
   */
  async resetDatabase() {
    const databaseService = this.app.get(DatabaseService);
    const sql = await databaseService.getSQL();
    await clearDatabase(sql);
    await seedTestData(sql);
  }

  async killApplication() {
    // Clean up internal and redis connections before exiting
    const cacheService = this.app.get(CacheService);
    await cacheService.onModuleDestroy();
    const databaseService = this.app.get(DatabaseService);
    await databaseService.onModuleDestroy();
  }

  async beforeEach() {
    await this.resetDatabase();

    // Purge the cache service to ensure things like refresh/access tokens aren't persisted
    const cacheService = this.app.get(CacheService);
    await cacheService.purge();
  }

  async afterAll() {
    await this.killApplication();
  }
}
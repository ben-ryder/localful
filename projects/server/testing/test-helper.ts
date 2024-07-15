import {INestApplication} from "@nestjs/common";
import {agent, SuperAgentTest} from "supertest";
import {createApp} from "../src/create-app";
import {DatabaseService} from "../src/services/database/database.service";
import {TokenService} from "../src/services/token/token.service";
import {UsersService} from "../src/modules/users/users.service";
import {TokenPair} from "@localful/common";
import {DataStoreService} from "../src/services/data-store/data-store.service";
import {resetTestData} from "./database-scripts";


export class TestHelper {
  app: INestApplication;
  client: SuperAgentTest;

  async beforeAll() {
    // Create app
    this.app = await createApp({logger: false})
    await this.app.init();

    // Setup supertest agent for test requests
    const httpServer = this.app.getHttpServer();
    this.client = agent(httpServer);
  }

  /**
   * Return a token pair for the given user.
   *
   * @param userId
   */
  async getUserTokens(userId: string): Promise<TokenPair> {
    const tokenService = this.app.get(TokenService);
    const userService = this.app.get(UsersService);
    const user = await userService._UNSAFE_get(userId)
    return await tokenService.createNewTokenPair(user);
  }


  /**
   * Return an access token for the given user.
   *
   * @param userId
   */
  async getUserAccessToken(userId: string): Promise<string> {
    const tokenPair = await this.getUserTokens(userId);
    return tokenPair.accessToken
  }

  /**
   * Reset the db to match the predefined test content.
   */
  async resetDatabase() {
    const databaseService = this.app.get(DatabaseService);
    const sql = await databaseService.getSQL();
    await resetTestData(sql);
  }

  /**
   * Kill the application gracefully, making sure all modules clean up as expected.
   */
  async killApplication() {
    // Clean up db connection before exiting
    const databaseService = this.app.get(DatabaseService);
    await databaseService.onModuleDestroy();

    const dataStoreService = this.app.get(DataStoreService);
    await dataStoreService.onModuleDestroy();
  }

  async beforeEach() {
    await this.resetDatabase();

    // Purge the data store to ensure things like refresh/access tokens aren't persisted
    const dataStoreService = this.app.get(DataStoreService);
    await dataStoreService.purge();
  }

  async afterAll() {
    await this.killApplication();
  }
}

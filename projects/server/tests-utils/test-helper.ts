import {INestApplication} from "@nestjs/common";
import {agent, SuperAgentTest} from "supertest";

import {resetTestData} from "@localful/testing";
import {createApp} from "../src/create-app";
import {DatabaseService} from "../src/services/database/database.service";
import {TokenService} from "../src/services/token/token.service";
import {UsersService} from "../src/modules/users/users.service";


export class TestHelper {
  // @ts-ignore
  app: INestApplication;
  // @ts-ignore
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
   * Return an API access token for the given user
   *
   * @param userId
   */
  async getUserAccessToken(userId: string): Promise<string> {
    const tokenService = this.app.get(TokenService);
    const userService = this.app.get(UsersService);
    const user = await userService._UNSAFE_get(userId)
    const tokenPair = await tokenService.createNewTokenPair(user);

    return tokenPair.accessToken
  }

  /**
   * Reset the db to match the predefined test content
   */
  async resetDatabase() {
    const databaseService = this.app.get(DatabaseService);
    const sql = await databaseService.getSQL();
    await resetTestData(sql);
  }

  async killApplication() {
    // Clean up db connection before exiting
    const databaseService = this.app.get(DatabaseService);
    await databaseService.onModuleDestroy();
  }

  async beforeEach() {
    await this.resetDatabase();
  }

  async afterAll() {
    await this.killApplication();
  }
}

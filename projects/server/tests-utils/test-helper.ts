import {INestApplication} from "@nestjs/common";
import {agent, SuperAgentTest} from "supertest";

import {resetTestData} from "@localful/testing";
import {createApp} from "../src/create-app.js";
import {DatabaseService} from "../src/services/database/database.service.js";
import {ConfigService} from "../src/services/config/config.js";


export class TestHelper {
  // @ts-ignore
  app: INestApplication;
  // @ts-ignore
  client: SuperAgentTest;

  async beforeAll() {
    // Create app
    this.app = await createApp({logger: false})
    await this.app.init();

    const configService = await this.app.get(ConfigService);

    // Setup supertest agent for test requests
    const httpServer = this.app.getHttpServer();
    this.client = agent(httpServer);
  }

  /**
   * Return an API access token for the given user
   *
   * @param userId
   * @param scopes
   */
  async getUserAccessToken(userId: string, scopes: string[]): Promise<string> {
    const configService = this.app.get(ConfigService);
    const iss = configService.config.auth.issuer;
    const aud = configService.config.auth.audience;

    // @todo: replace with real logic again
    return "accessToken"
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

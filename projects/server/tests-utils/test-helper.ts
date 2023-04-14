import {INestApplication} from "@nestjs/common";
import {agent, SuperAgentTest} from "supertest";
import createJWKSMock, {JWKSMock} from "mock-jwks"

import {resetTestData} from "./database-scripts";
import {createApp} from "../src/create-app";
import {DatabaseService} from "../src/services/database/database.service";
import {ConfigService} from "../src/services/config/config";


export class TestHelper {
  app: INestApplication;
  client: SuperAgentTest;
  jwksMock: JWKSMock;

  async beforeAll() {
    // Create app
    this.app = await createApp({logger: false})
    await this.app.init();

    // Setup JWKS mock
    const configService = await this.app.get(ConfigService);
    this.jwksMock = createJWKSMock(
      configService.config.auth.jwksOrigin,
      configService.config.auth.jwksPath,
    );
    this.jwksMock.start();

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

    return this.jwksMock.token({
      sub: userId,
      scope: scopes.join(" "),
      aud,
      iss
    });
  }

  /**
   * Reset the internal to match the predefined test content
   */
  async resetDatabase() {
    const databaseService = this.app.get(DatabaseService);
    const sql = await databaseService.getSQL();
    await resetTestData(sql);
  }

  async killApplication() {
    // Clean up internal and redis connections before exiting
    const databaseService = this.app.get(DatabaseService);
    await databaseService.onModuleDestroy();
  }

  async beforeEach() {
    await this.resetDatabase();
  }

  async afterAll() {
    await this.killApplication();
    this.jwksMock.stop();
  }
}

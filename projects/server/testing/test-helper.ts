import {agent, SuperAgentTest} from "supertest";
import {Server} from "node:http";

import {TokenPair} from "@localful/common";

import {createServer} from "../src/create-server.js";
import {resetTestData} from "./database-scripts.js";
import {ConfigService} from "@services/config/config.service.js";
import {UsersService} from "@modules/users/users.service.js";
import {TokenService} from "@services/token/token.service.js";
import {DatabaseService} from "@services/database/database.service.js";
import {DataStoreService} from "@services/data-store/data-store.service.js";
import {container} from "../src/di-container.js";


export class TestHelper {
  server: Server;
  client: SuperAgentTest;

  async beforeAll() {
    // Create app
    this.server = await createServer()

    // Overwrite the email mode to silence output and prevent actual email sending during test runs.;
    const configService = container.resolve<ConfigService>(ConfigService);
    configService.config.email.sendMode = "silent"

    // Setup supertest agent for test requests
    this.client = agent(this.server);
  }

  /**
   * Return a token pair for the given user.
   *
   * @param userId
   */
  async getUserTokens(userId: string): Promise<TokenPair> {
    const userService = container.resolve<UsersService>(UsersService);
    const tokenService = container.resolve<TokenService>(TokenService);
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

  async getEmailVerificationToken(userId: string): Promise<string> {
    const configService = container.resolve<ConfigService>(ConfigService);
    const tokenService = container.resolve<TokenService>(TokenService);

    return await tokenService.getActionToken({
      userId: userId,
      actionType: "verify-email",
      secret: configService.config.auth.emailVerification.secret,
      expiry: configService.config.auth.emailVerification.expiry
    })
  }

  /**
   * Reset the db to match the predefined test content.
   */
  async resetDatabase() {
    const databaseService = container.resolve<DatabaseService>(DatabaseService);
    const sql = await databaseService.getSQL();
    await resetTestData(sql);
  }

  /**
   * Kill the application gracefully, making sure all modules clean up as expected.
   */
  async killApplication() {
    const databaseService = container.resolve<DatabaseService>(DatabaseService);
    const dataStoreService = container.resolve<DataStoreService>(DataStoreService);

    // Clean up db connection before exiting
    await databaseService.onModuleDestroy();
    await dataStoreService.onModuleDestroy();
  }

  async beforeEach() {
    await this.resetDatabase();

    // Purge the data store to ensure things like refresh/access tokens aren't persisted
    const dataStoreService = container.resolve<DataStoreService>(DataStoreService);
    await dataStoreService.purge();
  }

  async afterAll() {
    await this.killApplication();
  }
}

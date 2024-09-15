import {agent, SuperAgentTest} from "supertest";
import {Server} from "node:http";

import {TokenPair} from "@localful/common";

import {resetTestData} from "./database-scripts.js";
import {ConfigService} from "@services/config/config.service.js";
import {UsersService} from "@modules/users/users.service.js";
import {TokenService} from "@services/token/token.service.js";
import {DatabaseService} from "@services/database/database.service.js";
import {DataStoreService} from "@services/data-store/data-store.service.js";
import {Application} from "../src/application.js";


export class TestHelper {
  private application: Application;
  public server: Server;
  public client: SuperAgentTest;

  async beforeAll() {
    // Create app
    this.application = new Application()
    this.server = await this.application.init()

    // Overwrite the email mode to silence output and prevent actual email sending during test runs.
    const configService = this.application.getDependency<ConfigService>(ConfigService);
    configService.config.email.sendMode = "silent"

    // Setup supertest agent for test requests
    this.client = agent(this.server);
  }

  getAppDependency<T>(dependency: any): T {
    return this.application.getDependency<T>(dependency);
  }

  /**
   * Return a token pair for the given user.
   *
   * @param userId
   */
  async getUserTokens(userId: string): Promise<TokenPair> {
    const userService = this.application.getDependency<UsersService>(UsersService);
    const tokenService = this.application.getDependency<TokenService>(TokenService);

    const user = await userService._UNSAFE_getById(userId)
    const createdTokenPair = await tokenService.createNewTokenPair(user);
    return createdTokenPair.tokens
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
    const configService = this.application.getDependency<ConfigService>(ConfigService);
    const tokenService = this.application.getDependency<TokenService>(TokenService);

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
    const databaseService = this.application.getDependency<DatabaseService>(DatabaseService);
    const sql = await databaseService.getSQL();
    await resetTestData(sql);
  }

  /**
   * Kill the application gracefully, making sure all modules clean up as expected.
   */
  async killApplication() {
    const databaseService = this.application.getDependency<DatabaseService>(DatabaseService);
    const dataStoreService = this.application.getDependency<DataStoreService>(DataStoreService);

    // Clean up db connection before exiting
    await databaseService.onModuleDestroy();
    await dataStoreService.onModuleDestroy();
  }

  async beforeEach() {
    await this.resetDatabase();

    // Purge the data store to ensure things like refresh/access tokens aren't persisted
    const dataStoreService = this.application.getDependency<DataStoreService>(DataStoreService);
    await dataStoreService.purge();
  }

  async afterAll() {
    await this.killApplication();
  }
}

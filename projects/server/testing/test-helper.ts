import {agent, SuperAgentTest} from "supertest";
import {Server} from "node:http";

import {TokenPair} from "@localful/common";

import databaseService from "@services/database/database.service.js";
import tokenService from "@services/token/token.service.js";
import dataStoreService from "@services/data-store/data-store.service.js";
import configService from "@services/config/config.service.js";
import userService from "@modules/users/users.service.js";

import {createServer} from "../src/create-server.js";
import {resetTestData} from "./database-scripts.js";


export class TestHelper {
  server: Server;
  client: SuperAgentTest;

  async beforeAll() {
    // Create app
    this.server = await createServer()

    // Overwrite the email mode to silence output and prevent actual email sending during test runs.;
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
    const sql = await databaseService.getSQL();
    await resetTestData(sql);
  }

  /**
   * Kill the application gracefully, making sure all modules clean up as expected.
   */
  async killApplication() {
    // Clean up db connection before exiting
    await databaseService.onModuleDestroy();
    await dataStoreService.onModuleDestroy();
  }

  async beforeEach() {
    await this.resetDatabase();

    // Purge the data store to ensure things like refresh/access tokens aren't persisted
    await dataStoreService.purge();
  }

  async afterAll() {
    await this.killApplication();
  }
}

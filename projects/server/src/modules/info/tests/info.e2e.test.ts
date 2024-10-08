import {describe, expect, test, beforeAll, beforeEach, afterAll } from "vitest";
import {TestHelper} from "@testing/test-helper.js";

const testHelper = new TestHelper();
beforeAll(async () => {
  await testHelper.beforeAll();
});
afterAll(async () => {
  await testHelper.afterAll()
});
beforeEach(async () => {
  await testHelper.beforeEach()
});


describe("Info Module",() => {
  /**
   * Base Route (/)
   */
  describe("/v1/info [GET]", () => {
    test("When a request is made, the response should be info message", async () => {
      const {body, statusCode} = await testHelper.client.get("/v1/info");

      expect(statusCode).toEqual(200);
      expect(body).toEqual({
        version: expect.any(String),
        registrationEnabled: expect.any(Boolean),
        limits: {
          vaultsPerUser: expect.any(Number),
          contentSize: expect.any(Number),
          vaultSize: expect.any(Number),
        }
      });
    })

    // @todo: test that registrationEnabled matches the current config?
  })
})

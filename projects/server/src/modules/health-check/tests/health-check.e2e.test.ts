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


describe("Health Check Module",() => {
  /**
   * Health Check Route (/v1/health)
   */
  describe("/v1/health [GET]", () => {
    test("When a request is made to a healthy server, the response should be an 'ok' health check", async () => {
      const {body, statusCode} = await testHelper.client.get("/v1/health");

      expect(statusCode).toEqual(200);
      expect(body).toEqual({
        status: "ok",
        services: {
          database: "ok",
          dataStore: "ok"
        }
      });
    })

    // @todo: test that server issues are reported correctly via health check
  })
})

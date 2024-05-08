import {TestHelper} from "../../../../tests-utils/test-helper";
import {expectNotFound} from "../../../../tests-utils/common-expects/expect-not-found";

describe("Generic 404 Response",() => {
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

  describe("/random-route [GET, POST, PATCH, DELETE]", () => {
    test("When a GET request is made to a random route, Then the response should be a '404 - not found'", async () => {
      const {body, statusCode} = await testHelper.client.get("/random-route");

      expectNotFound(body, statusCode);
    })

    test("When a POST request is made to a random route, Then the response should be a '404 - not found'", async () => {
      const {body, statusCode} = await testHelper.client.post("/random-route");

      expectNotFound(body, statusCode);
    })

    test("When a PATCH request is made to a random route, Then the response should be a '404 - not found'", async () => {
      const {body, statusCode} = await testHelper.client.patch("/random-route");

      expectNotFound(body, statusCode);
    })

    test("When a DELETE request is made to a random route, Then the response should be a '404 - not found'", async () => {
      const {body, statusCode} = await testHelper.client.delete("/random-route");

      expectNotFound(body, statusCode);
    })
  })
})

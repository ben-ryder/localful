import {TestHelper} from "../../../../tests-utils/test-helper";


describe("Info Module",() => {
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

  /**
   * Base Route (/)
   */
  describe("/v1/info [GET]", () => {
    test("When a request is made, the response should be info message", async () => {
      const {body, statusCode} = await testHelper.client.get("/v1/info");

      expect(statusCode).toEqual(200);
      expect(body).toEqual(expect.objectContaining({
        version: expect.any(String)
      }));
    })
  })
})

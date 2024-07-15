import {TestHelper} from "../../../../testing/test-helper";


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
  describe("/info [GET]", () => {
    test("When a request is made, the response should be info message", async () => {
      const {body, statusCode} = await testHelper.client.get("/info");

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

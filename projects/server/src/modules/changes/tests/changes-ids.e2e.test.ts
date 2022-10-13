import {TestHelper} from "../../../../tests/e2e/test-helper";


describe("Change Ids List - /v1/changes/ids [GET]",() => {
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

  describe("Success Cases", () => {
    test("Given the user is authenticated, When they request all change IDs, Then they should receive these", async => {
      //todo: write test
    })
  })

  describe("Invalid Authentication", () => {
    test("Given the user has no authentication, When they request their change IDs, Then the request should fail", async => {
      //todo: write test
    })

    test("Given the user has expired authentication, When they request their change IDs, Then the request should fail", async => {
      //todo: write test
    })

    test("Given the user has invalid authentication, When they request their change IDs, Then the request should fail", async => {
      //todo: write test
    })
  })
})

import {TestHelper} from "../../../../tests-utils/test-helper.js";


describe("Changes List - /v1/changes [GET]",() => {
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
    test("Given the user is authenticated, When they request all changes, Then they should receive all their changes", async () => {
      //todo: write test
      expect(true).toEqual(false);
    })

    test("Given the user is authenticated, When they request only specific changes, Then they should receive only those changes", async () => {
      //todo: write test
      expect(true).toEqual(false);
    })
  })

  describe("Invalid Authentication", () => {
    test("Given the user has no authentication, When they request their changes, Then the request should fail", async () => {
      //todo: write test
      expect(true).toEqual(false);
    })

    test("Given the user has expired authentication, When they request their changes, Then the request should fail", async () => {
      //todo: write test
      expect(true).toEqual(false);
    })

    test("Given the user has invalid authentication, When they request their changes, Then the request should fail", async () => {
      //todo: write test
      expect(true).toEqual(false);
    })
  })

  describe("Data Validation", () => {
    test("When the user sends the 'ids' query param with invalid data, Then the request should fail", async () => {
      //todo: write test
      expect(true).toEqual(false);
    })
  })
})

import {TestHelper} from "./test-helper";


describe("Short Description - /v1/path [METHOD]",() => {
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

  describe("Success Cases", () => {})

  describe("Invalid Authentication", () => {})

  describe("None Unique Data", () => {})

  describe("Data Validation", () => {})

  describe("Required Fields", () => {})

  describe("Forbidden Fields", () => {})

  describe("Invalid Data", () => {})
})

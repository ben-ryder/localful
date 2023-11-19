import {TestHelper} from "./test-helper";
import {testUsers} from "./test-data";


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

  // Testing success cases/happy paths work.
  describe("Happy Paths", () => {

    test("Given CONTEXT, When ACTION, Then RESULT", async () => {
      const accessToken = await testHelper.getUserAccessToken(testUsers[0].id);

      const {body, statusCode} = await testHelper.client
        .post("/v1/ROUTE")
        .set("Authorization", `Bearer ${accessToken}`)
        .send({});

      expect(statusCode).toEqual(200);
      expect(body).toEqual(expect.objectContaining({
        field: "value",
      }))
    });

  })

  // Testing auth & user permissions work.
  describe("Authentication & Permissions", () => {
  })

  // Testing all unique constraint work.
  describe("Unique Validation", () => {})

  // Testing all required field work.
  describe("Required Field Validation", () => {})

  // Testing internal/system fields are not user editable (timestamps, id, owner relationships etc).
  describe("Forbidden Field Validation", () => {})

  // Testing logical validation works (string formats like email, number ranges, etc)
  describe("Logical Validation", () => {})

  // Testing relationship validation works (fails on invalid foreign keys).
  describe("Relationship Validation", () => {})

  // Testing invalid type validation works (pass number to sting field, malformed data etc).
  describe("Type Validation", () => {})
})

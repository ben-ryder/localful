import {ErrorIdentifiers} from "@localful/common";
import {TestHelper} from "../../../../tests-utils/test-helper";
import {expectUnauthorized} from "../../../../tests-utils/common-expects/expect-unauthorized";
import {expectForbidden} from "../../../../tests-utils/common-expects/expect-forbidden";
import {expectBadRequest} from "../../../../tests-utils/common-expects/expect-bad-request";


describe("Get User - /v1/users/:id [GET]",() => {
  const testHelper: TestHelper = new TestHelper();

  beforeAll(async () => {
    await testHelper.beforeAll();
  });
  afterAll(async () => {
    await testHelper.afterAll()
  });
  beforeEach(async () => {
    await testHelper.beforeEach()
  });

  test("When unauthorized, the request should fail", async () => {
    const {body, statusCode} = await testHelper.client.get(`/v1/users/${testUsers[0].id}`);

    expectUnauthorized(body, statusCode);
  })

  test("When authorized as the user to get, the response should succeed and return the user", async () => {
    const accessToken = await testHelper.getUserAccessToken(testUsers[0]);

    const {body, statusCode} = await testHelper.client
      .get(`/v1/users/${testUsers[0].id}`)
      .set("Authorization", `Bearer ${accessToken}`);

    const expectedUser = {
      id: testUsers[0].id,
      username: testUsers[0].username,
      email: testUsers[0].email,
      encryptionSecret: testUsers[0].encryptionSecret,
      isVerified: testUsers[0].isVerified,
      createdAt: testUsers[0].createdAt,
      updatedAt: testUsers[0].updatedAt
    };

    expect(statusCode).toEqual(200);
    expect(body).toEqual(expectedUser);
  })

  test("When authorized as a different user to the one to get, the request should fail", async () => {
    const accessToken = await testHelper.getUserAccessToken(testUsers[0]);

    const {body, statusCode} = await testHelper.client
      .get(`/v1/users/${testUsers[1].id}`)
      .set("Authorization", `Bearer ${accessToken}`);

    expectForbidden(body, statusCode);
  })

  test("When fetching a user that doesn't exist, the request should fail", async () => {
    const accessToken = await testHelper.getUserAccessToken(testUsers[0]);

    const {body, statusCode} = await testHelper.client
      .get("/v1/users/82f7d7a4-e094-4f15-9de0-5b5621376714")
      .set("Authorization", `Bearer ${accessToken}`);

    expectForbidden(body, statusCode);
  })

  test("When passing an invalid ID, the request should fail", async () => {
    const accessToken = await testHelper.getUserAccessToken(testUsers[0]);

    const {body, statusCode} = await testHelper.client
      .get("/v1/users/invalid")
      .set("Authorization", `Bearer ${accessToken}`);

    expectBadRequest(body, statusCode, ErrorIdentifiers.REQUEST_INVALID);
  })
})

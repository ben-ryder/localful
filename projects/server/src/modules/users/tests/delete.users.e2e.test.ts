import {ErrorIdentifiers} from "@localful/common";
import {TestHelper} from "../../../../tests-utils/test-helper";
import {expectUnauthorized} from "../../../../tests-utils/common-expects/expect-unauthorized";
import {expectForbidden} from "../../../../tests-utils/common-expects/expect-forbidden";
import {expectBadRequest} from "../../../../tests-utils/common-expects/expect-bad-request";


describe("Delete User - /v1/users/:id [DELETE]",() => {
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
    const {body, statusCode} = await testHelper.client.delete(`/v1/users/${testUsers[0].id}`);

    expectUnauthorized(body, statusCode);
  })

  test("When authorized as the user to delete, the request & deletion should succeed", async () => {
    const accessToken = await testHelper.getUserAccessToken(testUsers[0]);

    // Make the delete request
    const {statusCode: deleteStatusCode} = await testHelper.client
      .delete(`/v1/users/${testUsers[0].id}`)
      .set("Authorization", `Bearer ${accessToken}`);
    expect(deleteStatusCode).toEqual(200);

    // Re-fetch the user to ensure it's been deleted
    // todo: BUG? at this point the users token should have been blacklisted and no longer be valid?
    const {statusCode: getStatusCode} = await testHelper.client
      .get(`/v1/users/${testUsers[0].id}`)
      .set("Authorization", `Bearer ${accessToken}`);
    expect(getStatusCode).toEqual(404);

  })

  test("When authorized as a different user to the one to delete, the request should fail", async () => {
    const accessToken = await testHelper.getUserAccessToken(testUsers[0]);

    const {body, statusCode} = await testHelper.client
      .delete("/v1/users/82f7d7a4-e094-4f15-9de0-5b5621376714")
      .set("Authorization", `Bearer ${accessToken}`);

    expectForbidden(body, statusCode)
  })

  test("When attempting to delete a none existent user, the request should fail", async () => {
    const accessToken = await testHelper.getUserAccessToken(testUsers[0]);

    const {body, statusCode} = await testHelper.client
      .delete("/v1/users/82f7d7a4-e094-4f15-9de0-5b5621376714")
      .set("Authorization", `Bearer ${accessToken}`);

    expectForbidden(body, statusCode);
  })

  test("When passing an invalid user ID, the request should fail", async () => {
    const accessToken = await testHelper.getUserAccessToken(testUsers[0]);

    const {body, statusCode} = await testHelper.client
      .delete("/v1/users/invalid")
      .set("Authorization", `Bearer ${accessToken}`);

    expectBadRequest(body, statusCode, ErrorIdentifiers.REQUEST_INVALID);
  })
})

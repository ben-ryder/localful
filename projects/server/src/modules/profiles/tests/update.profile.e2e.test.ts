import {TestHelper} from "../../../../tests-utils/test-helper";
import {seedProfiles, testCaseProfiles} from "../../../../tests-utils/test-data";
import {AccessControlScopes} from "@ben-ryder/lfb-common";
import {HttpStatus} from "@nestjs/common";
import {expectUnauthorized} from "../../../../tests-utils/common-expects/expect-unauthorized";
import {expectForbidden} from "../../../../tests-utils/common-expects/expect-forbidden";


describe("Update Profile - /v1/profiles [PATCH]",() => {
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

    test("Given user with `profiles:update:self` scope, When updating profile with matching userId, Then profile should be updated", async () => {
      const updatedEncryptionSecret = "new value";
      const accessToken = await testHelper.getUserAccessToken(seedProfiles[0].userId, [
        AccessControlScopes.PROFILES_UPDATE_SELF, AccessControlScopes.PROFILES_RETRIEVE_SELF
      ]);

      const {statusCode} = await testHelper.client
        .patch(`/v1/profiles/${seedProfiles[0].userId}`)
        .set("Authorization", `Bearer ${accessToken}`)
        .send({
          encryptionSecret: updatedEncryptionSecret
        });
      expect(statusCode).toEqual(HttpStatus.OK);

      const {statusCode: checkStatusCode, body: checkBody} = await testHelper.client
        .get(`/v1/profiles/${seedProfiles[0].userId}`)
        .set("Authorization", `Bearer ${accessToken}`)
        .send();

      expect(checkStatusCode).toEqual(HttpStatus.OK);
      expect(checkBody).toEqual(expect.objectContaining({
        userId: seedProfiles[0].userId,
        encryptionSecret: updatedEncryptionSecret,
        createdAt: expect.any(String),
        updatedAt: expect.any(String)
      }))
    });

    test("Given user with `profiles:update` scope, When updating profile with matching userId, Then profile should be updated", async () => {
      const updatedEncryptionSecret = "new value";
      const accessToken = await testHelper.getUserAccessToken(seedProfiles[0].userId, [
        AccessControlScopes.PROFILES_UPDATE, AccessControlScopes.PROFILES_RETRIEVE
      ]);

      const {statusCode} = await testHelper.client
        .patch(`/v1/profiles/${seedProfiles[0].userId}`)
        .set("Authorization", `Bearer ${accessToken}`)
        .send({
          encryptionSecret: updatedEncryptionSecret
        });
      expect(statusCode).toEqual(HttpStatus.OK);

      const {statusCode: checkStatusCode, body: checkBody} = await testHelper.client
        .get(`/v1/profiles/${seedProfiles[0].userId}`)
        .set("Authorization", `Bearer ${accessToken}`)
        .send();

      expect(checkStatusCode).toEqual(HttpStatus.OK);
      expect(checkBody).toEqual(expect.objectContaining({
        userId: seedProfiles[0].userId,
        encryptionSecret: updatedEncryptionSecret,
        createdAt: expect.any(String),
        updatedAt: expect.any(String)
      }))
    });

    test("Given user with `profiles:update` scope, When updating profile with different userId, Then profile should be updated", async () => {
      const updatedEncryptionSecret = "new value";
      const accessToken = await testHelper.getUserAccessToken(seedProfiles[0].userId, [
        AccessControlScopes.PROFILES_UPDATE, AccessControlScopes.PROFILES_RETRIEVE
      ]);

      const {statusCode} = await testHelper.client
        .patch(`/v1/profiles/${seedProfiles[1].userId}`)
        .set("Authorization", `Bearer ${accessToken}`)
        .send({
          encryptionSecret: updatedEncryptionSecret
        });
      expect(statusCode).toEqual(HttpStatus.OK);

      const {statusCode: checkStatusCode, body: checkBody} = await testHelper.client
        .get(`/v1/profiles/${seedProfiles[1].userId}`)
        .set("Authorization", `Bearer ${accessToken}`)
        .send();

      expect(checkStatusCode).toEqual(HttpStatus.OK);
      expect(checkBody).toEqual(expect.objectContaining({
        userId: seedProfiles[1].userId,
        encryptionSecret: updatedEncryptionSecret,
        createdAt: expect.any(String),
        updatedAt: expect.any(String)
      }))
    });
  })

  // Testing auth & user permissions work.
  describe("Authentication & Permissions", () => {
    test("Given user with no auth, When updating profile, Then response should be '401 - unauthorized'", async () => {
      const {statusCode, body} = await testHelper.client
        .patch(`/v1/profiles/${seedProfiles[0].userId}`)
        .send({
          encryptionSecret: "new value"
        });

      expectUnauthorized(body, statusCode);
    });

    test("Given user with no `profiles` scopes, When updating profile, Then response should be '403 - forbidden'", async () => {
      const accessToken = await testHelper.getUserAccessToken(seedProfiles[0].userId, []);

      const {statusCode, body} = await testHelper.client
        .patch(`/v1/profiles/${seedProfiles[0].userId}`)
        .set("Authorization", `Bearer ${accessToken}`)
        .send({
          encryptionSecret: "new value"
        });

      expectForbidden(body, statusCode);
    });

    test("Given user with `profiles:update:self` scope, When updating profile with different userId, Then response should be '403 - forbidden'", async () => {
      const accessToken = await testHelper.getUserAccessToken(seedProfiles[0].userId, [
        AccessControlScopes.PROFILES_UPDATE_SELF, AccessControlScopes.PROFILES_RETRIEVE_SELF
      ]);

      const {statusCode, body} = await testHelper.client
        .patch(`/v1/profiles/${seedProfiles[1].userId}`)
        .set("Authorization", `Bearer ${accessToken}`)
        .send({
          encryptionSecret: "new value"
        });

      expectForbidden(body, statusCode);
    });
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

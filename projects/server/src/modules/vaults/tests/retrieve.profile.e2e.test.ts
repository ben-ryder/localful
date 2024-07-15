
import {HttpStatus} from "@nestjs/common";
import {AccessControlScopes, ErrorIdentifiers} from "@ben-ryder/lfb-common";
import {TestHelper} from "../../../../tests-utils/test-helper";
import {seedProfiles, testCaseProfiles} from "../../../../tests-utils/test-data";
import {expectUnauthorized} from "../../../../tests-utils/common-expects/expect-unauthorized";
import {expectForbidden} from "../../../../tests-utils/common-expects/expect-forbidden";
import {expectNotFound} from "../../../../tests-utils/common-expects/expect-not-found";


describe("Retrieve Profile - /v1/profiles/:userId [GET]",() => {
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

    test("Given user with `profiles:retrieve:self`, When retrieving profile with matching userId, Then profile should be returned", async () => {
      const accessToken = await testHelper.getUserAccessToken(seedProfiles[0].userId, [AccessControlScopes.PROFILES_RETRIEVE_SELF]);

      const {body, statusCode} = await testHelper.client
        .get(`/v1/profiles/${seedProfiles[0].userId}`)
        .set("Authorization", `Bearer ${accessToken}`)
        .send({});

      expect(statusCode).toEqual(HttpStatus.OK);
      expect(body).toEqual(expect.objectContaining({
        userId: seedProfiles[0].userId,
        encryptionSecret: seedProfiles[0].encryptionSecret,
        createdAt: seedProfiles[0].createdAt,
        updatedAt: seedProfiles[0].updatedAt,
      }))
    });

    test("Given user with `profiles:retrieve:self` and profile doesn't exist, When retrieving profile with matching userId, Then response should be '404 - not found'", async () => {
      const accessToken = await testHelper.getUserAccessToken(testCaseProfiles.example.userId, [AccessControlScopes.PROFILES_RETRIEVE_SELF]);

      const {body, statusCode} = await testHelper.client
        .get(`/v1/profiles/${testCaseProfiles.example.userId}`)
        .set("Authorization", `Bearer ${accessToken}`)
        .send({});

      expectNotFound(body, statusCode, ErrorIdentifiers.PROFILE_NOT_FOUND);
    });

    test("Given user with `profiles:retrieve`, When retrieving profile with matching userId, Then profile should be returned", async () => {
      const accessToken = await testHelper.getUserAccessToken(seedProfiles[0].userId, [AccessControlScopes.PROFILES_RETRIEVE]);

      const {body, statusCode} = await testHelper.client
        .get(`/v1/profiles/${seedProfiles[0].userId}`)
        .set("Authorization", `Bearer ${accessToken}`)
        .send({});

      expect(statusCode).toEqual(HttpStatus.OK);
      expect(body).toEqual(expect.objectContaining({
        userId: seedProfiles[0].userId,
        encryptionSecret: seedProfiles[0].encryptionSecret,
        createdAt: seedProfiles[0].createdAt,
        updatedAt: seedProfiles[0].updatedAt,
      }))
    });

    test("Given user with `profiles:retrieve`, When retrieving profile with different userId, Then profile should be returned", async () => {
      const accessToken = await testHelper.getUserAccessToken(seedProfiles[0].userId, [AccessControlScopes.PROFILES_RETRIEVE]);

      const {body, statusCode} = await testHelper.client
        .get(`/v1/profiles/${seedProfiles[1].userId}`)
        .set("Authorization", `Bearer ${accessToken}`)
        .send({});

      expect(statusCode).toEqual(HttpStatus.OK);
      expect(body).toEqual(expect.objectContaining({
        userId: seedProfiles[1].userId,
        encryptionSecret: seedProfiles[1].encryptionSecret,
        createdAt: seedProfiles[1].createdAt,
        updatedAt: seedProfiles[1].updatedAt,
      }))
    });
  })

  // Testing auth & user permissions work.
  describe("Authentication & Permissions", () => {
    test("Given user with no auth, When retrieving profile, Then response should be '401 - unauthorised'", async () => {
      const {body, statusCode} = await testHelper.client
        .get(`/v1/profiles/${seedProfiles[0].userId}`)
        .send({});

      expectUnauthorized(body, statusCode);
    });

    test("Given user with `profiles:retrieve:self` scope, When retrieving profile with different userId, Then response should be '403 - forbidden'", async () => {
      const accessToken = await testHelper.getUserAccessToken(seedProfiles[0].userId, [AccessControlScopes.PROFILES_RETRIEVE_SELF]);

      const {body, statusCode} = await testHelper.client
        .get(`/v1/profiles/${seedProfiles[1].userId}`)
        .set("Authorization", `Bearer ${accessToken}`)
        .send({});

      expectForbidden(body, statusCode);
    });

    test("Given user without 'profiles' scopes, When retrieving profile with matching userId, Then response should be '403 - forbidden'", async () => {
      const accessToken = await testHelper.getUserAccessToken(seedProfiles[0].userId, []);

      const {body, statusCode} = await testHelper.client
        .get(`/v1/profiles/${seedProfiles[0].userId}`)
        .set("Authorization", `Bearer ${accessToken}`)
        .send({});

      expectForbidden(body, statusCode);
    });

    test("Given user without `profiles` scopes, When retrieving profile with different userId, Then response should be '403 - forbidden'", async () => {
      const accessToken = await testHelper.getUserAccessToken(seedProfiles[0].userId, []);

      const {body, statusCode} = await testHelper.client
        .get(`/v1/profiles/${seedProfiles[1].userId}`)
        .set("Authorization", `Bearer ${accessToken}`)
        .send({});

      expectForbidden(body, statusCode);
    });
  })

  describe("Logical Validation", () => {
    test("Given user with `profiles:retrieve` scope, When retrieving profile with invalid userId, Then response should be '404 - not found'", async () => {
      const accessToken = await testHelper.getUserAccessToken(seedProfiles[0].userId, [AccessControlScopes.PROFILES_RETRIEVE]);

      const {body, statusCode} = await testHelper.client
        .get("/v1/profiles/random")
        .set("Authorization", `Bearer ${accessToken}`)
        .send({});

      expectNotFound(body, statusCode, ErrorIdentifiers.PROFILE_NOT_FOUND);
    });

    test("Given user with `profiles:retrieve:self` scope, When retrieving profile with invalid userId, Then response should be '403 - forbidden'", async () => {
      const accessToken = await testHelper.getUserAccessToken(seedProfiles[0].userId, [AccessControlScopes.PROFILES_RETRIEVE_SELF]);

      const {body, statusCode} = await testHelper.client
        .get("/v1/profiles/random")
        .set("Authorization", `Bearer ${accessToken}`)
        .send({});

      expectForbidden(body, statusCode);
    });
  })
})

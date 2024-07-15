import {HttpStatus} from "@nestjs/common";
import {TestHelper} from "../../../../tests-utils/test-helper";
import {expectUnauthorized} from "../../../../tests-utils/common-expects/expect-unauthorized";
import {expectForbidden} from "../../../../tests-utils/common-expects/expect-forbidden";
import {expectNotFound} from "../../../../tests-utils/common-expects/expect-not-found";


// describe("Delete Profile - /v1/profiles/:userId [DELETE]",() => {
//   const testHelper = new TestHelper();
//
//   beforeAll(async () => {
//     await testHelper.beforeAll();
//   });
//   afterAll(async () => {
//     await testHelper.afterAll()
//   });
//   beforeEach(async () => {
//     await testHelper.beforeEach()
//   });
//
//   // Testing success cases/happy paths work.
//   describe("Happy Paths", () => {
//
//     test("Given user with `profiles:delete:self` scopes, When deleting profile with matching userId, Then profile should be deleted", async () => {
//       const accessToken = await testHelper.getUserAccessToken(seedProfiles[0].userId, [
//         AccessControlScopes.PROFILES_DELETE_SELF, AccessControlScopes.PROFILES_RETRIEVE_SELF
//       ]);
//
//       const {statusCode} = await testHelper.client
//         .delete(`/v1/profiles/${seedProfiles[0].userId}`)
//         .set("Authorization", `Bearer ${accessToken}`)
//         .send();
//       expect(statusCode).toEqual(HttpStatus.OK);
//
//       const {statusCode: checkStatusCode} = await testHelper.client
//         .get(`/v1/profiles/${seedProfiles[0].userId}`)
//         .set("Authorization", `Bearer ${accessToken}`)
//         .send();
//       expect(checkStatusCode).toEqual(HttpStatus.NOT_FOUND);
//     });
//
//     test("Given user with `profiles:delete`, When deleting profile with matching userId, Then profile should be deleted", async () => {
//       const accessToken = await testHelper.getUserAccessToken(seedProfiles[0].userId, [AccessControlScopes.PROFILES_DELETE, AccessControlScopes.PROFILES_RETRIEVE]);
//
//       const {statusCode} = await testHelper.client
//         .delete(`/v1/profiles/${seedProfiles[0].userId}`)
//         .set("Authorization", `Bearer ${accessToken}`)
//         .send();
//       expect(statusCode).toEqual(HttpStatus.OK);
//
//       const {statusCode: checkStatusCode} = await testHelper.client
//         .get(`/v1/profiles/${seedProfiles[0].userId}`)
//         .set("Authorization", `Bearer ${accessToken}`)
//         .send();
//       expect(checkStatusCode).toEqual(HttpStatus.NOT_FOUND);
//     });
//
//     test("Given user with `profiles:delete profiles:retrieve`, When deleting profile with different userId, Then profile should be deleted", async () => {
//       const accessToken = await testHelper.getUserAccessToken(seedProfiles[0].userId, [AccessControlScopes.PROFILES_DELETE, AccessControlScopes.PROFILES_RETRIEVE]);
//
//       const {statusCode} = await testHelper.client
//         .delete(`/v1/profiles/${seedProfiles[1].userId}`)
//         .set("Authorization", `Bearer ${accessToken}`)
//         .send();
//       expect(statusCode).toEqual(HttpStatus.OK);
//
//       const {statusCode: checkStatusCode} = await testHelper.client
//         .get(`/v1/profiles/${seedProfiles[1].userId}`)
//         .set("Authorization", `Bearer ${accessToken}`)
//         .send();
//       expect(checkStatusCode).toEqual(HttpStatus.NOT_FOUND);
//     });
//
//     test("When deleting profile, Then profile and matching user changes should be deleted", async () => {
//       const accessToken = await testHelper.getUserAccessToken(seedProfiles[0].userId, [
//         AccessControlScopes.PROFILES_DELETE, AccessControlScopes.PROFILES_RETRIEVE, AccessControlScopes.CHANGES_RETRIEVE_SELF
//       ]);
//
//       const {statusCode} = await testHelper.client
//         .delete(`/v1/profiles/${seedProfiles[0].userId}`)
//         .set("Authorization", `Bearer ${accessToken}`)
//         .send();
//       expect(statusCode).toEqual(HttpStatus.OK);
//
//       const {statusCode: fetchStatusCode} = await testHelper.client
//         .get(`/v1/profiles/${seedProfiles[0].userId}`)
//         .set("Authorization", `Bearer ${accessToken}`)
//         .send();
//       expect(fetchStatusCode).toEqual(HttpStatus.NOT_FOUND);
//
//       const {body: idsBody} = await testHelper.client
//         .get(`/v1/changes/${seedProfiles[0].userId}/ids`)
//         .set("Authorization", `Bearer ${accessToken}`)
//         .send();
//       expect(idsBody).toHaveLength(0);
//     });
//   })
//
//   // Testing auth & user permissions work.
//   describe("Authentication & Permissions", () => {
//     test("Given user with no auth, When deleting profile, Then response should be '401 - unauthorised'", async () => {
//       const {body, statusCode} = await testHelper.client
//         .delete(`/v1/profiles/${seedProfiles[0].userId}`)
//         .send({});
//
//       expectUnauthorized(body, statusCode);
//     });
//
//     test("Given user with `profiles:delete:self` scope, When deleting profile with different userId, Then response should be '403 - forbidden'", async () => {
//       const accessToken = await testHelper.getUserAccessToken(seedProfiles[0].userId, [AccessControlScopes.PROFILES_DELETE_SELF]);
//
//       const {body, statusCode} = await testHelper.client
//         .delete(`/v1/profiles/${seedProfiles[1].userId}`)
//         .set("Authorization", `Bearer ${accessToken}`)
//         .send({});
//
//       expectForbidden(body, statusCode);
//     });
//
//     test("Given user without 'profiles' scopes, When deleting profile with matching userId, Then response should be '403 - forbidden'", async () => {
//       const accessToken = await testHelper.getUserAccessToken(seedProfiles[0].userId, []);
//
//       const {body, statusCode} = await testHelper.client
//         .delete(`/v1/profiles/${seedProfiles[0].userId}`)
//         .set("Authorization", `Bearer ${accessToken}`)
//         .send({});
//
//       expectForbidden(body, statusCode);
//     });
//
//     test("Given user without `profiles` scopes, When deleting profile with different userId, Then response should be '403 - forbidden'", async () => {
//       const accessToken = await testHelper.getUserAccessToken(seedProfiles[0].userId, []);
//
//       const {body, statusCode} = await testHelper.client
//         .delete(`/v1/profiles/${seedProfiles[1].userId}`)
//         .set("Authorization", `Bearer ${accessToken}`)
//         .send({});
//
//       expectForbidden(body, statusCode);
//     });
//   })
//
//   describe("Logical Validation", () => {
//     test("Given user with `profiles:delete` scope, When deleting profile with invalid userId, Then response should be '404 - not found'", async () => {
//       const accessToken = await testHelper.getUserAccessToken(seedProfiles[0].userId, [AccessControlScopes.PROFILES_DELETE]);
//
//       const {body, statusCode} = await testHelper.client
//         .delete("/v1/profiles/random")
//         .set("Authorization", `Bearer ${accessToken}`)
//         .send({});
//
//       expectNotFound(body, statusCode, ErrorIdentifiers.PROFILE_NOT_FOUND);
//     });
//
//     test("Given user with `profiles:delete:self` scope, When deleting profile with invalid userId, Then response should be '403 - forbidden'", async () => {
//       const accessToken = await testHelper.getUserAccessToken(seedProfiles[0].userId, [AccessControlScopes.PROFILES_DELETE_SELF]);
//
//       const {body, statusCode} = await testHelper.client
//         .delete("/v1/profiles/random")
//         .set("Authorization", `Bearer ${accessToken}`)
//         .send({});
//
//       expectForbidden(body, statusCode);
//     });
//   })
// })

import {AccessControlScopes, ErrorIdentifiers} from "@ben-ryder/lfb-common";
import { TestHelper } from "../../../../tests-utils/test-helper";
import {testCaseProfiles, seedProfiles} from "../../../../tests-utils/test-data";
import {expectForbidden} from "../../../../tests-utils/common-expects/expect-forbidden";
import {expectBadRequest} from "../../../../tests-utils/common-expects/expect-bad-request";
import {testMalformedData} from "../../../../tests-utils/common-expects/test-malformed-data";
import {testInvalidDataTypes} from "../../../../tests-utils/common-expects/test-invalid-data-types";


describe("Create Profile - /v1/profiles [POST]",() => {
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

	describe("Happy Paths", () => {
		test("Given user with `profiles:create:self` scope, When creating profile with matching userId, Then profile should be created & returned", async () => {
			const accessToken = await testHelper.getUserAccessToken(testCaseProfiles.example.userId, [AccessControlScopes.PROFILES_CREATE_SELF]);

			const {body, statusCode} = await testHelper.client
				.post("/v1/profiles")
				.set("Authorization", `Bearer ${accessToken}`)
				.send({
					userId: testCaseProfiles.example.userId,
					encryptionSecret: testCaseProfiles.example.encryptionSecret
				});

			expect(statusCode).toEqual(201);
			expect(body).toEqual(expect.objectContaining({
				userId: testCaseProfiles.example.userId,
				encryptionSecret: testCaseProfiles.example.encryptionSecret,
				createdAt: expect.any(String),
				updatedAt: expect.any(String)
			}))
		})

		test("Given user with `profiles:create` scope, When creating profile with matching userId, Then profile should be created & returned", async () => {
			const accessToken = await testHelper.getUserAccessToken(testCaseProfiles.example.userId, [AccessControlScopes.PROFILES_CREATE]);

			const {body, statusCode} = await testHelper.client
				.post("/v1/profiles")
				.set("Authorization", `Bearer ${accessToken}`)
				.send({
					userId: testCaseProfiles.example.userId,
					encryptionSecret: testCaseProfiles.example.encryptionSecret
				});

			expect(statusCode).toEqual(201);
			expect(body).toEqual(expect.objectContaining({
				userId: testCaseProfiles.example.userId,
				encryptionSecret: testCaseProfiles.example.encryptionSecret,
				createdAt: expect.any(String),
				updatedAt: expect.any(String)
			}))
		})

		test("Given user with `profiles:create` scope, When creating profile with different userId, Then profile should be created & returned", async () => {
			const accessToken = await testHelper.getUserAccessToken(seedProfiles[0].userId, [AccessControlScopes.PROFILES_CREATE]);

			const {body, statusCode} = await testHelper.client
				.post("/v1/profiles")
				.set("Authorization", `Bearer ${accessToken}`)
				.send({
					userId: testCaseProfiles.example.userId,
					encryptionSecret: testCaseProfiles.example.encryptionSecret
				});

			expect(statusCode).toEqual(201);
			expect(body).toEqual(expect.objectContaining({
				userId: testCaseProfiles.example.userId,
				encryptionSecret: testCaseProfiles.example.encryptionSecret,
				createdAt: expect.any(String),
				updatedAt: expect.any(String)
			}))
		})
	})

	describe("Authentication & Permissions", () => {
		test("Given user with `profiles:create:self` scope, When creating profile with different userId, Then request should be '403 - forbidden'", async () => {
			const accessToken = await testHelper.getUserAccessToken(seedProfiles[0].userId, [AccessControlScopes.PROFILES_CREATE_SELF]);

			const {body, statusCode} = await testHelper.client
				.post("/v1/profiles")
				.set("Authorization", `Bearer ${accessToken}`)
				.send({
					userId: testCaseProfiles.example.userId,
					encryptionSecret: testCaseProfiles.example.encryptionSecret
				});

			expectForbidden(body, statusCode);
		})

		test("Given user with no scopes, When creating profile with matching userId, Then request should be '403 - forbidden'", async () => {
			const accessToken = await testHelper.getUserAccessToken(testCaseProfiles.example.userId, []);

			const {body, statusCode} = await testHelper.client
				.post("/v1/profiles")
				.set("Authorization", `Bearer ${accessToken}`)
				.send({
					userId: testCaseProfiles.example.userId,
					encryptionSecret: testCaseProfiles.example.encryptionSecret
				});

			expectForbidden(body, statusCode);
		})
	})

	describe("Unique Validation", () => {
		test("Given user with existing profile and `profiles:create:self` scope, When creating profile with matching userId, Then response should be 'HTTP 400 - bad request'", async () => {
			const accessToken = await testHelper.getUserAccessToken(seedProfiles[0].userId, [AccessControlScopes.PROFILES_CREATE]);

			const {body, statusCode} = await testHelper.client
				.post("/v1/profiles")
				.set("Authorization", `Bearer ${accessToken}`)
				.send({
					userId: seedProfiles[0].userId,
					encryptionSecret: seedProfiles[0].encryptionSecret
				});

			expectBadRequest(body, statusCode, ErrorIdentifiers.PROFILE_ALREADY_EXISTS);
		})

		test("Given user A with existing profile and user B with `profiles:create` scope, When user B create profile with userId of user A, Then response should be 'HTTP 400 - bad request'", async () => {
			const accessToken = await testHelper.getUserAccessToken(seedProfiles[0].userId, [AccessControlScopes.PROFILES_CREATE]);

			const {body, statusCode} = await testHelper.client
				.post("/v1/profiles")
				.set("Authorization", `Bearer ${accessToken}`)
				.send({
					userId: seedProfiles[1].userId,
					encryptionSecret: seedProfiles[1].encryptionSecret
				});

			expectBadRequest(body, statusCode, ErrorIdentifiers.PROFILE_ALREADY_EXISTS);
		})
	})

	describe("Required Field Validation", () => {
		test("When creating profile without userId, Then response should be 'HTTP 400 - bad request'", async () => {
			const accessToken = await testHelper.getUserAccessToken(testCaseProfiles.example.userId, [AccessControlScopes.PROFILES_CREATE_SELF]);

			const {body, statusCode} = await testHelper.client
				.post("/v1/profiles")
				.set("Authorization", `Bearer ${accessToken}`)
				.send({
					encryptionSecret: testCaseProfiles.example.encryptionSecret
				});

			expectBadRequest(body, statusCode);
		})

		test("When creating profile without encryptionSecret, Then response should be 'HTTP 400 - bad request'", async () => {
			const accessToken = await testHelper.getUserAccessToken(testCaseProfiles.example.userId, [AccessControlScopes.PROFILES_CREATE_SELF]);

			const {body, statusCode} = await testHelper.client
				.post("/v1/profiles")
				.set("Authorization", `Bearer ${accessToken}`)
				.send({
					userId: testCaseProfiles.example.userId
				});

			expectBadRequest(body, statusCode);
		})
	})

	describe("Forbidden Field Validation", () => {
		test("When creating profile with createdAt field, Then response should be 'HTTP 400 - bad request'", async () => {
			const accessToken = await testHelper.getUserAccessToken(testCaseProfiles.example.userId, [AccessControlScopes.PROFILES_CREATE_SELF]);

			const {body, statusCode} = await testHelper.client
				.post("/v1/profiles")
				.set("Authorization", `Bearer ${accessToken}`)
				.send({
					userId: testCaseProfiles.example.userId,
					encryptionSecret: testCaseProfiles.example.encryptionSecret,
					createdAt: testCaseProfiles.example.createdAt,
				});

			expectBadRequest(body, statusCode);
		})

		test("When creating profile with updatedAt field, Then response should be 'HTTP 400 - bad request'", async () => {
			const accessToken = await testHelper.getUserAccessToken(testCaseProfiles.example.userId, [AccessControlScopes.PROFILES_CREATE_SELF]);

			const {body, statusCode} = await testHelper.client
				.post("/v1/profiles")
				.set("Authorization", `Bearer ${accessToken}`)
				.send({
					userId: testCaseProfiles.example.userId,
					encryptionSecret: testCaseProfiles.example.encryptionSecret,
					updatedAt: testCaseProfiles.example.updatedAt
				});

			expectBadRequest(body, statusCode);
		})
	})

	describe("Logical Validation", () => {
		test("Given user with `profiles:create:self` scope, When creating profile with empty userId string, Then response should be 'HTTP 400 - bad request'", async () => {
			const accessToken = await testHelper.getUserAccessToken(testCaseProfiles.example.userId, [AccessControlScopes.PROFILES_CREATE_SELF]);

			const {body, statusCode} = await testHelper.client
				.post("/v1/profiles")
				.set("Authorization", `Bearer ${accessToken}`)
				.send({
					userId: "",
					encryptionSecret: testCaseProfiles.example.encryptionSecret
				});

			expectBadRequest(body, statusCode);
		})

		test("Given user with `profiles:create` scope, When creating profile with empty userId string, Then response should be 'HTTP 400 - bad request'", async () => {
			const accessToken = await testHelper.getUserAccessToken(testCaseProfiles.example.userId, [AccessControlScopes.PROFILES_CREATE]);

			const {body, statusCode} = await testHelper.client
				.post("/v1/profiles")
				.set("Authorization", `Bearer ${accessToken}`)
				.send({
					userId: "",
					encryptionSecret: testCaseProfiles.example.encryptionSecret
				});

			expectBadRequest(body, statusCode);
		})

		test("When creating profile with userId length 1, Then profile should be created & returned", async () => {
			const accessToken = await testHelper.getUserAccessToken(testCaseProfiles.userIdLengthOne.userId, [AccessControlScopes.PROFILES_CREATE_SELF]);

			const {body, statusCode} = await testHelper.client
				.post("/v1/profiles")
				.set("Authorization", `Bearer ${accessToken}`)
				.send({
					userId: testCaseProfiles.userIdLengthOne.userId,
					encryptionSecret: testCaseProfiles.userIdLengthOne.encryptionSecret
				});

			expect(statusCode).toEqual(201);
			expect(body).toEqual(expect.objectContaining({
				userId: testCaseProfiles.userIdLengthOne.userId,
				encryptionSecret: testCaseProfiles.userIdLengthOne.encryptionSecret,
				createdAt: expect.any(String),
				updatedAt: expect.any(String)
			}))
		})

		test("When creating profile with userId length 100, Then profile should be created & returned", async () => {
			const accessToken = await testHelper.getUserAccessToken(testCaseProfiles.userIdLengthOneHundred.userId, [AccessControlScopes.PROFILES_CREATE_SELF]);

			const {body, statusCode} = await testHelper.client
				.post("/v1/profiles")
				.set("Authorization", `Bearer ${accessToken}`)
				.send({
					userId: testCaseProfiles.userIdLengthOneHundred.userId,
					encryptionSecret: testCaseProfiles.userIdLengthOneHundred.encryptionSecret
				});

			expect(statusCode).toEqual(201);
			expect(body).toEqual(expect.objectContaining({
				userId: testCaseProfiles.userIdLengthOneHundred.userId,
				encryptionSecret: testCaseProfiles.userIdLengthOneHundred.encryptionSecret,
				createdAt: expect.any(String),
				updatedAt: expect.any(String)
			}))
		})

		test("When creating profile with userId length 101, Then response should be 'HTTP 400 - bad request'", async () => {
			const userId = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaab";
			const encryptionSecret = "test";
			const accessToken = await testHelper.getUserAccessToken(userId, [AccessControlScopes.PROFILES_CREATE_SELF]);

			const {body, statusCode} = await testHelper.client
				.post("/v1/profiles")
				.set("Authorization", `Bearer ${accessToken}`)
				.send({
					userId: userId,
					encryptionSecret: encryptionSecret
				});

			expectBadRequest(body, statusCode);
		})

		test("When creating profile with empty encryptionSecret string, Then response should be 'HTTP 400 - bad request'", async () => {
			const accessToken = await testHelper.getUserAccessToken(testCaseProfiles.example.userId, [AccessControlScopes.PROFILES_CREATE_SELF]);

			const {body, statusCode} = await testHelper.client
				.post("/v1/profiles")
				.set("Authorization", `Bearer ${accessToken}`)
				.send({
					userId: testCaseProfiles.example.userId,
					encryptionSecret: ""
				});

			expectBadRequest(body, statusCode);
		})

		test("When creating profile with encryptionSecret length 1, Then profile should be created & returned", async () => {
			const accessToken = await testHelper.getUserAccessToken(testCaseProfiles.encryptionSecretLengthOne.userId, [AccessControlScopes.PROFILES_CREATE_SELF]);

			const {body, statusCode} = await testHelper.client
				.post("/v1/profiles")
				.set("Authorization", `Bearer ${accessToken}`)
				.send({
					userId: testCaseProfiles.encryptionSecretLengthOne.userId,
					encryptionSecret: testCaseProfiles.encryptionSecretLengthOne.encryptionSecret
				});

			expect(statusCode).toEqual(201);
			expect(body).toEqual(expect.objectContaining({
				userId: testCaseProfiles.encryptionSecretLengthOne.userId,
				encryptionSecret: testCaseProfiles.encryptionSecretLengthOne.encryptionSecret,
				createdAt: expect.any(String),
				updatedAt: expect.any(String)
			}))
		})
	})

	describe("Type Validation", () => {
		test("When creating profile with invalid JSON data, Then response should be 'HTTP 400 - bad request'", async () => {
			const accessToken = await testHelper.getUserAccessToken(testCaseProfiles.example.userId, [AccessControlScopes.PROFILES_CREATE_SELF]);

			await testMalformedData({
				clientFunction: testHelper.client.post.bind(testHelper.client),
				accessToken: accessToken,
				endpoint: "/v1/profiles"
			})
		})

		describe("When creating profile with userId not a string, Then response should be 'HTTP 400 - bad request'", () => {
				testInvalidDataTypes({
					testFieldKey: "userId",
					testCases: [1, 1.5, true, null, undefined, {hello: "world"}, [1, 2]],
					req: {
						clientMethod: "post",
						endpoint: "/v1/profiles",
						initialData: {
							userId: testCaseProfiles.example.userId,
							encryptionKey: testCaseProfiles.example.encryptionSecret
						},
					},
					auth: {
						userId: testCaseProfiles.example.userId,
						scopes: [AccessControlScopes.PROFILES_CREATE_SELF],
					},
					testHelper: testHelper
				})
		})

		describe("When creating profile with encryptionSecret not a string, Then response should be 'HTTP 400 - bad request'", () => {
			testInvalidDataTypes({
				testFieldKey: "userId",
				testCases: [1, 1.5, true, null, undefined, {hello: "world"}, [1, 2]],
				req: {
					clientMethod: "post",
					endpoint: "/v1/profiles",
					initialData: {
						userId: testCaseProfiles.example.userId,
						encryptionKey: testCaseProfiles.example.encryptionSecret
					},
				},
				auth: {
					userId: testCaseProfiles.example.userId,
					scopes: [AccessControlScopes.PROFILES_CREATE_SELF],
				},
				testHelper: testHelper
			})
		})
	})
})

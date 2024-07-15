import { TestHelper } from "../../../../testing/test-helper";
import {expectForbidden} from "../../../../testing/common/expect-forbidden";
import {expectBadRequest} from "../../../../testing/common/expect-bad-request";
import {testMalformedData} from "../../../../testing/common/test-malformed-data";
import {testInvalidDataTypes} from "../../../../testing/common/test-invalid-data-types";
import {ErrorIdentifiers} from "@localful/common";
import {testMissingField} from "../../../../testing/common/test-missing-field";
import {testAdminUser1, testUser1, testUser2} from "../../../../testing/data/users";
import {exampleVault1, testUser1Vault1} from "../../../../testing/data/vaults";

describe("Create Vaults - /v1/vaults [POST]",() => {
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

	describe("Success Cases", () => {
		test("Given user with `user` role, When creating vault with matching ownerId, Then vault should be created & returned", async () => {
			const accessToken = await testHelper.getUserAccessToken(testUser1.id);

			const {body, statusCode} = await testHelper.client
				.post("/v1/vaults")
				.set("Authorization", `Bearer ${accessToken}`)
				.send({...exampleVault1, ownerId: testUser1.id});

			expect(statusCode).toEqual(201);
			expect(body).toEqual(expect.objectContaining({
				...exampleVault1,
				ownerId: testUser1.id,
			}))
		})

		test("Given user with `admin` role, When creating vault with matching ownerId, Then vault should be created & returned", async () => {
			const accessToken = await testHelper.getUserAccessToken(testUser2.id);

			const {body, statusCode} = await testHelper.client
				.post("/v1/vaults")
				.set("Authorization", `Bearer ${accessToken}`)
				.send({...exampleVault1, ownerId: testUser2.id});

			expect(statusCode).toEqual(201);
			expect(body).toEqual(expect.objectContaining({...exampleVault1, ownerId: testUser2.id}));
		})

		test("Given user with `admin` role, When creating vault with different ownerId, Then vault should be created & returned", async () => {
			const accessToken = await testHelper.getUserAccessToken(testAdminUser1.id);

			const {body, statusCode} = await testHelper.client
				.post("/v1/vaults")
				.set("Authorization", `Bearer ${accessToken}`)
				.send({...exampleVault1, ownerId: testUser1.id});

			expect(statusCode).toEqual(201);
			expect(body).toEqual(expect.objectContaining({...exampleVault1, ownerId: testUser1.id}))
		})

		test("When creating vault with no optional protectedData, Then vault should be created & returned", async () => {
			const accessToken = await testHelper.getUserAccessToken(testUser1.id);

			const {body, statusCode} = await testHelper.client
				.post("/v1/vaults")
				.set("Authorization", `Bearer ${accessToken}`)
				.send({
					...exampleVault1,
					ownerId: testUser1.id,
					protectedData: undefined
				});

			expect(statusCode).toEqual(201);
			expect(body).toEqual(expect.objectContaining({
				...exampleVault1,
				protectedData: null
			}))
		})

		test("Given user A with existing vault, When user B creates vault with matching name, Then vault should be created & returned", async () => {
			const accessToken = await testHelper.getUserAccessToken(testUser2.id);

			const {body, statusCode} = await testHelper.client
				.post("/v1/vaults")
				.set("Authorization", `Bearer ${accessToken}`)
				.send({
					...testUser1Vault1,
					id: "561b9baa-0e9f-4354-8f93-931437169c24",
				});

			expect(statusCode).toEqual(201);
			expect(body).toEqual(expect.objectContaining({
				...testUser1Vault1,
				ownerId: testUser2.id,
			}))
		})
	})

	describe("Authentication & Permissions", () => {
		test("Given user with `user` role, When creating vault with different ownerId, Then request should be '403 - forbidden'", async () => {
			const accessToken = await testHelper.getUserAccessToken(testUser1.id);

			const {body, statusCode} = await testHelper.client
				.post("/v1/vaults")
				.set("Authorization", `Bearer ${accessToken}`)
				.send({
					...exampleVault1,
					ownerId: testUser2.id,
				});

			expectForbidden(body, statusCode);
		})
	})

	describe("Unique Validation", () => {
		// todo: add test that name constraint should only apply at a user level
		test("Given user with existing vault and `user` role, When creating vault with matching name, Then response should be 'HTTP 400 - bad request'", async () => {
			const accessToken = await testHelper.getUserAccessToken(testUser1.id);

			const {body, statusCode} = await testHelper.client
				.post("/v1/vaults")
				.set("Authorization", `Bearer ${accessToken}`)
				.send({
					...testUser1Vault1,
					id: "561b9baa-0e9f-4354-8f93-931437169c24",
				});

			expectBadRequest(body, statusCode, ErrorIdentifiers.REQUEST_INVALID);
		})

		test("Given user with existing vault and `user` role, When creating vault with matching id, Then response should be 'HTTP 400 - bad request'", async () => {
			const accessToken = await testHelper.getUserAccessToken(testUser1.id);

			const {body, statusCode} = await testHelper.client
				.post("/v1/vaults")
				.set("Authorization", `Bearer ${accessToken}`)
				.send({
					...testUser1Vault1,
					name: "uniqueName1",
				});

			expectBadRequest(body, statusCode, ErrorIdentifiers.REQUEST_INVALID);
		})

		test("Given user A with existing vault and user B with `admin` role, When user B creates vault for user A with matching name, Then response should be 'HTTP 400 - bad request'", async () => {
			const accessToken = await testHelper.getUserAccessToken(testUser2.id);

			const {body, statusCode} = await testHelper.client
				.post("/v1/vaults")
				.set("Authorization", `Bearer ${accessToken}`)
				.send({
					...testUser1Vault1,
					id: "561b9baa-0e9f-4354-8f93-931437169c24",
				});

			expectBadRequest(body, statusCode, ErrorIdentifiers.REQUEST_INVALID);
		})

		test("Given user A with existing vault and user B with `admin` role, When user B creates vault for user A with matching id, Then response should be 'HTTP 400 - bad request'", async () => {
			const accessToken = await testHelper.getUserAccessToken(testUser2.id);

			const {body, statusCode} = await testHelper.client
				.post("/v1/vaults")
				.set("Authorization", `Bearer ${accessToken}`)
				.send({
					...testUser1Vault1,
					name: "uniqueName1",
				});

			expectBadRequest(body, statusCode, ErrorIdentifiers.REQUEST_INVALID);
		})
	})

	describe("Required Field Validation", () => {
		test("When creating vault without an id, Then response should be 'HTTP 400 - bad request'", async () => {
			const accessToken = await testHelper.getUserAccessToken(testUser1.id);

			await testMissingField({
				clientFunction: testHelper.client.post.bind(testHelper.client),
				accessToken: accessToken,
				endpoint: "/v1/vaults",
				data: exampleVault1,
				testFieldKey: "id"
			})
		})

		test("When creating vault without ownerId, Then response should be 'HTTP 400 - bad request'", async () => {
			const accessToken = await testHelper.getUserAccessToken(testUser1.id);

			await testMissingField({
				clientFunction: testHelper.client.post.bind(testHelper.client),
				accessToken: accessToken,
				endpoint: "/v1/vaults",
				data: exampleVault1,
				testFieldKey: "ownerId"
			})
		})

		test("When creating vault without protectedEncryptionKey, Then response should be 'HTTP 400 - bad request'", async () => {
			const accessToken = await testHelper.getUserAccessToken(testUser1.id);

			await testMissingField({
				clientFunction: testHelper.client.post.bind(testHelper.client),
				accessToken: accessToken,
				endpoint: "/v1/vaults",
				data: exampleVault1,
				testFieldKey: "protectedEncryptionKey"
			})
		})

		test("When creating vault without name, Then response should be 'HTTP 400 - bad request'", async () => {
			const accessToken = await testHelper.getUserAccessToken(testUser1.id);

			await testMissingField({
				clientFunction: testHelper.client.post.bind(testHelper.client),
				accessToken: accessToken,
				endpoint: "/v1/vaults",
				data: exampleVault1,
				testFieldKey: "name"
			})
		})

		test("When creating vault without createdAt, Then response should be 'HTTP 400 - bad request'", async () => {
			const accessToken = await testHelper.getUserAccessToken(testUser1.id);

			await testMissingField({
				clientFunction: testHelper.client.post.bind(testHelper.client),
				accessToken: accessToken,
				endpoint: "/v1/vaults",
				data: exampleVault1,
				testFieldKey: "createdAt"
			})
		})

		test("When creating vault without updatedAt, Then response should be 'HTTP 400 - bad request'", async () => {
			const accessToken = await testHelper.getUserAccessToken(testUser1.id);

			await testMissingField({
				clientFunction: testHelper.client.post.bind(testHelper.client),
				accessToken: accessToken,
				endpoint: "/v1/vaults",
				data: exampleVault1,
				testFieldKey: "updatedAt"
			})
		})
	})

	// describe("Forbidden Field Validation", () => {})

	// describe("Logical Validation", () => {})

	describe("Type Validation", () => {
		test("When creating vault with invalid JSON data, Then response should be 'HTTP 400 - bad request'", async () => {
			const accessToken = await testHelper.getUserAccessToken(testUser1.id);

			await testMalformedData({
				clientFunction: testHelper.client.post.bind(testHelper.client),
				accessToken: accessToken,
				endpoint: "/v1/vaults"
			})
		})

		describe("When creating vault with ownerId which is not a uuid, Then response should be 'HTTP 400 - bad request'", () => {
				testInvalidDataTypes({
					testFieldKey: "ownerId",
					testCases: ["", "random-string", 1, 1.5, true, null, undefined, {hello: "world"}, [1, 2]],
					req: {
						clientMethod: "post",
						endpoint: "/v1/vaults",
						initialData: exampleVault1,
					},
					auth: {
						userId: testUser1.id,
					},
					testHelper: testHelper
				})
		})

		// todo: add boundary tests for 1, 100 etc
		describe("When creating vault with name which is not a string between 1-100, Then response should be 'HTTP 400 - bad request'", () => {
			testInvalidDataTypes({
				testFieldKey: "ownerId",
				testCases: ["", 1, 1.5, true, null, undefined, {hello: "world"}, [1, 2], "a".repeat(101)],
				req: {
					clientMethod: "post",
					endpoint: "/v1/vaults",
					initialData: exampleVault1,
				},
				auth: {
					userId: testUser1.id,
				},
				testHelper: testHelper
			})
		})

		// todo: add boundary tests for 1, 255 etc
		describe("When creating vault with protectedEncryptionKey which is not a string between 1-255, Then response should be 'HTTP 400 - bad request'", () => {
			testInvalidDataTypes({
				testFieldKey: "ownerId",
				testCases: ["", 1, 1.5, true, null, undefined, {hello: "world"}, [1, 2], "a".repeat(256)],
				req: {
					clientMethod: "post",
					endpoint: "/v1/vaults",
					initialData: exampleVault1,
				},
				auth: {
					userId: testUser1.id,
				},
				testHelper: testHelper
			})
		})

		// todo: add boundary tests for 1, 100 etc
		describe("When creating vault with protectedData which is not a string of at least 1 char, Then response should be 'HTTP 400 - bad request'", () => {
			testInvalidDataTypes({
				testFieldKey: "ownerId",
				// protectedData id nullable field, so don't need to test undefined or null here
				testCases: ["", 1, 1.5, true, {hello: "world"}, [1, 2]],
				req: {
					clientMethod: "post",
					endpoint: "/v1/vaults",
					initialData: exampleVault1,
				},
				auth: {
					userId: testUser1.id,
				},
				testHelper: testHelper
			})
		})
	})
})

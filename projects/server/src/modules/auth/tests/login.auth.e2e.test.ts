import {TestHelper} from "../../../../tests/e2e/test-helper";
import {testUsers} from "../../../../tests/test-data/test-data";
import {expectForbidden} from "../../../../tests/e2e/common-expects/expect-forbidden";
import {ErrorIdentifiers} from "@localful/common";
import {testMissingField} from "../../../../tests/e2e/common-expects/test-missing-field";
import {testMalformedData} from "../../../../tests/e2e/common-expects/test-malformed-data";
import {testInvalidDataTypes} from "../../../../tests/e2e/common-expects/test-invalid-data-types";


describe("Login Auth",() => {
  const testHelper = new TestHelper();

  beforeAll(async () => {
    await testHelper.beforeAll()
  })
  afterAll(async () => {
    await testHelper.afterAll()
  });
  beforeEach(async () => {
    await testHelper.beforeEach()
  });

  describe("Success Cases", () => {
    test("When supplying valid credentials, the user data and tokens should be returned", async () => {
      const {body, statusCode} = await testHelper.client
        .post("/v1/auth/login")
        .send({
          username: testUsers[0].username,
          password: testUsers[0].serverPassword
        });

      expect(statusCode).toEqual(200);
      expect(body).toEqual(expect.objectContaining({
        user: {
          id: testUsers[0].id,
          username: testUsers[0].username,
          email: testUsers[0].email,
          isVerified: testUsers[0].isVerified,
          encryptionSecret: testUsers[0].encryptionSecret,
          createdAt: testUsers[0].createdAt,
          updatedAt: testUsers[0].updatedAt
        },
        accessToken: expect.any(String),
        refreshToken: expect.any(String),
      }))
    })
  })

  describe("Fail Cases", () => {
    test("When supplying completely invalid credentials, the request should fail", async () => {
      const {body, statusCode} = await testHelper.client
        .post("/v1/auth/login")
        .send({
          username: "random username",
          password: "random password"
        });

      expectForbidden(body, statusCode, ErrorIdentifiers.AUTH_CREDENTIALS_INVALID)
    })

    test("When supplying the wrong password, the request should fail", async () => {
      const {body, statusCode} = await testHelper.client
        .post("/v1/auth/login")
        .send({
          username: testUsers[0].username,
          password: "random password"
        });

      expectForbidden(body, statusCode, ErrorIdentifiers.AUTH_CREDENTIALS_INVALID)
    })

    test("When supplying a correct password but wrong username, the request should fail", async () => {
      const {body, statusCode} = await testHelper.client
        .post("/v1/auth/login")
        .send({
          username: "randomuser",
          password: testUsers[0].serverPassword
        });

      expectForbidden(body, statusCode, ErrorIdentifiers.AUTH_CREDENTIALS_INVALID)
    })
  })

  describe("Required Fields", () => {
    test("When not supplying a username, the request should fail", async () => {
      const accessToken = await testHelper.getUserAccessToken(testUsers[0]);

      await testMissingField({
        clientFunction: testHelper.client.post.bind(testHelper.client),
        accessToken: accessToken,
        endpoint: "/v1/auth/login",
        data: {
          username: testUsers[0].username,
          password: testUsers[0].serverPassword
        },
        testFieldKey: "username"
      })
    })

    test("When not supplying a password, the request should fail", async () => {
      const accessToken = await testHelper.getUserAccessToken(testUsers[0]);

      await testMissingField({
        clientFunction: testHelper.client.post.bind(testHelper.client),
        accessToken: accessToken,
        endpoint: "/v1/auth/login",
        data: {
          username: testUsers[0].username,
          password: testUsers[0].serverPassword
        },
        testFieldKey: "password"
      })
    })
  })

  describe("Invalid Data", () => {
    test("When supplying invalid JSON data, the request should fail", async () => {
      const accessToken = await testHelper.getUserAccessToken(testUsers[0]);

      await testMalformedData({
        clientFunction: testHelper.client.post.bind(testHelper.client),
        endpoint: "/v1/auth/login",
        accessToken: accessToken
      })
    })

    describe("When not supplying username as a string, the request should fail", () => {
      testInvalidDataTypes({
        testHelper: testHelper,
        clientMethod: "post",
        user: testUsers[0],
        endpoint: "/v1/auth/login",
        data: {
          password: "test-password"
        },
        testFieldKey: "username",
        testCases: [1, 1.5, true, null, {test: "yes"}, [1, 2]]
      })
    })

    describe("When not supplying password as a string, the request should fail", () => {
      testInvalidDataTypes({
        testHelper: testHelper,
        clientMethod: "post",
        user: testUsers[0],
        endpoint: "/v1/auth/login",
        data: {
          username: "testuser"
        },
        testFieldKey: "password",
        testCases: [1, 1.5, true, null, {test: "yes"}, [1, 2]]
      })
    })
  })
})

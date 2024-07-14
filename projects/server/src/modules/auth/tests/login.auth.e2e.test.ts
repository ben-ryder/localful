import {TestHelper} from "../../../../tests-utils/test-helper";
import {expectForbidden} from "../../../../tests-utils/common-expects/expect-forbidden";
import {testMissingField} from "../../../../tests-utils/common-expects/test-missing-field";
import {testMalformedData} from "../../../../tests-utils/common-expects/test-malformed-data";
import {testInvalidDataTypes} from "../../../../tests-utils/common-expects/test-invalid-data-types";
import {ErrorIdentifiers} from "@localful/common"
import {testUsers} from "../../../../tests-utils/test-data";


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
          email: testUsers[0].email,
          password: testUsers[0].serverPassword
        });

      expect(statusCode).toEqual(200);
      expect(body).toEqual(expect.objectContaining({
        user: {
          id: testUsers[0].id,
          email: testUsers[0].email,
          displayName: testUsers[0].displayName,
          isVerified: testUsers[0].isVerified,
          role: testUsers[0].role,
          createdAt: testUsers[0].createdAt,
          updatedAt: testUsers[0].updatedAt
        },
        tokens: {
          accessToken: expect.any(String),
          refreshToken: expect.any(String),
        }
      }))

      // Check no password data is included in fetches user
      // todo: should this be a separate test?
      expect(body).not.toEqual(expect.objectContaining({
        passwordHash: testUsers[0].passwordHash,
        password: testUsers[0].serverPassword
      }))
    })
  })

  describe("Fail Cases", () => {
    test("When supplying completely invalid credentials, the request should fail", async () => {
      const {body, statusCode} = await testHelper.client
        .post("/v1/auth/login")
        .send({
          email: "random@example.com",
          password: "random password"
        });

      expectForbidden(body, statusCode, ErrorIdentifiers.AUTH_CREDENTIALS_INVALID)
    })

    test("When supplying the wrong password, the request should fail", async () => {
      const {body, statusCode} = await testHelper.client
        .post("/v1/auth/login")
        .send({
          email: testUsers[0].email,
          password: "random password"
        });

      expectForbidden(body, statusCode, ErrorIdentifiers.AUTH_CREDENTIALS_INVALID)
    })

    test("When supplying a correct password but wrong email, the request should fail", async () => {
      const {body, statusCode} = await testHelper.client
        .post("/v1/auth/login")
        .send({
          email: "randomuser@example.com",
          password: testUsers[0].serverPassword
        });

      expectForbidden(body, statusCode, ErrorIdentifiers.AUTH_CREDENTIALS_INVALID)
    })
  })

  describe("Required Fields", () => {
    test("When not supplying an email, the request should fail", async () => {
      await testMissingField({
        clientFunction: testHelper.client.post.bind(testHelper.client),
        endpoint: "/v1/auth/login",
        data: {
          email: testUsers[0].email,
          password: testUsers[0].serverPassword
        },
        testFieldKey: "email"
      })
    })

    test("When not supplying a password, the request should fail", async () => {
      await testMissingField({
        clientFunction: testHelper.client.post.bind(testHelper.client),
        endpoint: "/v1/auth/login",
        data: {
          email: testUsers[0].email,
          password: testUsers[0].serverPassword
        },
        testFieldKey: "password"
      })
    })
  })

  describe("Invalid Data", () => {
    test("When supplying invalid JSON data, the request should fail", async () => {
      const accessToken = await testHelper.getUserAccessToken(testUsers[0].id);

      await testMalformedData({
        clientFunction: testHelper.client.post.bind(testHelper.client),
        endpoint: "/v1/auth/login",
        accessToken: accessToken
      })
    })

    describe("When not supplying email as a string, the request should fail", () => {
      testInvalidDataTypes({
        testHelper: testHelper,
        req: {
          clientMethod: "post",
          endpoint: "/v1/auth/login",
          initialData: {
            password: "test-password"
          }
        },
        testFieldKey: "email",
        testCases: [1, 1.5, true, null, {test: "yes"}, [1, 2]]
      })
    })

    describe("When not supplying password as a string, the request should fail", () => {
      testInvalidDataTypes({
        testHelper: testHelper,
        req: {
          clientMethod: "post",
          endpoint: "/v1/auth/login",
          initialData: {
            email: testUsers[0].email,
          }
        },
        testFieldKey: "password",
        testCases: [1, 1.5, true, null, {test: "yes"}, [1, 2]]
      })
    })
  })
})

import {TestHelper} from "../../../../testing/test-helper";
import {expectForbidden} from "../../../../testing/common/expect-forbidden";
import {testMissingField} from "../../../../testing/common/test-missing-field";
import {testMalformedData} from "../../../../testing/common/test-malformed-data";
import {testInvalidDataTypes} from "../../../../testing/common/test-invalid-data-types";
import {ErrorIdentifiers} from "@localful/common"
import {testUser1} from "../../../../testing/data/users";


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
          email: testUser1.email,
          password: testUser1.serverPassword
        });

      expect(statusCode).toEqual(200);
      expect(body).toEqual(expect.objectContaining({
        user: {
          id: testUser1.id,
          email: testUser1.email,
          displayName: testUser1.displayName,
          isVerified: testUser1.isVerified,
          role: testUser1.role,
          createdAt: testUser1.createdAt,
          updatedAt: testUser1.updatedAt
        },
        tokens: {
          accessToken: expect.any(String),
          refreshToken: expect.any(String),
        }
      }))

      // Check no password data is included in fetches user
      // todo: should this be a separate test?
      expect(body).not.toEqual(expect.objectContaining({
        passwordHash: testUser1.passwordHash,
        password: testUser1.serverPassword
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
          email: testUser1.email,
          password: "random password"
        });

      expectForbidden(body, statusCode, ErrorIdentifiers.AUTH_CREDENTIALS_INVALID)
    })

    test("When supplying a correct password but wrong email, the request should fail", async () => {
      const {body, statusCode} = await testHelper.client
        .post("/v1/auth/login")
        .send({
          email: "randomuser@example.com",
          password: testUser1.serverPassword
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
          email: testUser1.email,
          password: testUser1.serverPassword
        },
        testFieldKey: "email"
      })
    })

    test("When not supplying a password, the request should fail", async () => {
      await testMissingField({
        clientFunction: testHelper.client.post.bind(testHelper.client),
        endpoint: "/v1/auth/login",
        data: {
          email: testUser1.email,
          password: testUser1.serverPassword
        },
        testFieldKey: "password"
      })
    })
  })

  describe("Invalid Data", () => {
    test("When supplying invalid JSON data, the request should fail", async () => {
      const accessToken = await testHelper.getUserAccessToken(testUser1.id);

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
            email: testUser1.email,
          }
        },
        testFieldKey: "password",
        testCases: [1, 1.5, true, null, {test: "yes"}, [1, 2]]
      })
    })
  })
})

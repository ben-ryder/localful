import {ErrorIdentifiers} from "@localful/common";
import {TestHelper} from "../../../../tests-utils/test-helper";
import {expectBadRequest} from "../../../../tests-utils/common-expects/expect-bad-request";
import {testMissingField} from "../../../../tests-utils/common-expects/test-missing-field";
import {testMalformedData} from "../../../../tests-utils/common-expects/test-malformed-data";
import {testInvalidDataTypes} from "../../../../tests-utils/common-expects/test-invalid-data-types";
import {exampleUsers, testUsers} from "../../../../tests-utils/test-data";


// A default user which can be reused in multiple data to save a bit of copy-pasting.
// Uses Object.freeze to ensure no test can modify it
const defaultTestUser = Object.freeze({
  email: exampleUsers[0].email,
  displayName: exampleUsers[0].displayName,
  password: exampleUsers[0].password,
});

describe("Add User - /v1/users [POST]",() => {
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
    test("When adding a valid new user, the new user should be added & returned", async () => {
      const {body, statusCode} = await testHelper.client
        .post("/v1/users")
        .send(defaultTestUser);

      expect(statusCode).toEqual(201);
      expect(body).toEqual(expect.objectContaining({
        user: {
          id: expect.any(String),
          email: defaultTestUser.email,
          displayName: defaultTestUser.displayName,
          isVerified: false,
          role: exampleUsers[0].role ,// assuming defaultTestUser will always be exampleUser[0]!
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        },
        tokens: {
          accessToken: expect.any(String),
          refreshToken: expect.any(String)
        }
      }))
    })

    test("When adding a valid new user, the returned access and refresh tokens should be valid", async () => {
      // todo: consider adding access & refresh token data for /v1/users [POST]
    })

    test("When using a password that's 12 characters, the new user should be added & returned", async () => {
      const newUser = {
        ...defaultTestUser,
        password: "password1234!",
      }

      const {statusCode} = await testHelper.client
        .post("/v1/users")
        .send(newUser);

      expect(statusCode).toEqual(201);
    })

    // test("When using a username that's 1 character, the new user should be added & returned", async () => {
    //   const newUser = {
    //     ...defaultTestUser,
    //     username: "a"
    //   }
    //
    //   const {body, statusCode} = await testHelper.client
    //     .post("/v1/users")
    //     .send(newUser);
    //
    //   expect(statusCode).toEqual(201);
    //   expect(body).toEqual(expect.objectContaining({
    //     user: {
    //       id: expect.any(String),
    //       email: newUser.email,
    //       isVerified: false,
    //       encryptionSecret: newUser.encryptionSecret,
    //       createdAt: expect.any(String),
    //       updatedAt: expect.any(String)
    //     },
    //     accessToken: expect.any(String),
    //     refreshToken: expect.any(String)
    //   }))
    // })

    // test("When using a username that's 20 characters, the new user should be added & returned", async () => {
    //   const newUser = {
    //     ...defaultTestUser,
    //     username: "qwertyuiopasdfghjklz"
    //   }
    //
    //   const {body, statusCode} = await testHelper.client
    //     .post("/v1/users")
    //     .send(newUser);
    //
    //   expect(statusCode).toEqual(201);
    //   expect(body).toEqual(expect.objectContaining({
    //     user: {
    //       id: expect.any(String),
    //       email: newUser.email,
    //       isVerified: false,
    //       encryptionSecret: newUser.encryptionSecret,
    //       createdAt: expect.any(String),
    //       updatedAt: expect.any(String)
    //     },
    //     accessToken: expect.any(String),
    //     refreshToken: expect.any(String)
    //   }))
    // })
  })

  describe("None Unique Data", () => {
    test("When using an existing email, the request should fail", async () => {
      const newUser = {
        ...defaultTestUser,
        email: testUsers[0].email,
      }

      const {body, statusCode} = await testHelper.client
        .post("/v1/users")
        .send(newUser);

      expectBadRequest(body, statusCode, ErrorIdentifiers.USER_EMAIL_EXISTS);
    })
  })

  describe("Data Validation", () => {
    test("When using an invalid email, the request should fail", async () => {
      const newUser = {
        ...defaultTestUser,
        email: "invalid-email"
      }

      const {body, statusCode} = await testHelper.client
        .post("/v1/users")
        .send(newUser);

      expectBadRequest(body, statusCode)
    })

    // todo: add boundary tests for this
    test("When using a password that's too short, the request should fail", async () => {
      const newUser = {
        ...defaultTestUser,
        password: "hi"
      }

      const {body, statusCode} = await testHelper.client
        .post("/v1/users")
        .send(newUser);

      expectBadRequest(body, statusCode)
    })

    // @todo: add max length to email schema and re-add this test
    // test("When using a email that's too long, the request should fail", async () => {
    //   const newUser = {
    //     ...defaultTestUser,
    //     email: "this-is-a-username-which-is-over-the-maximum"
    //   }
    //
    //   const {body, statusCode} = await testHelper.client
    //     .post("/v1/users")
    //     .send(newUser);
    //
    //   expectBadRequest(body, statusCode)
    // })
  })

  describe("Required Fields", () => {
    test("When not supplying an email, the request should fail", async () => {
      const accessToken = await testHelper.getUserAccessToken(testUsers[0].id);

      await testMissingField({
        clientFunction: testHelper.client.post.bind(testHelper.client),
        accessToken: accessToken,
        endpoint: "/v1/users",
        data: defaultTestUser,
        testFieldKey: "email"
      })
    })

    test("When not supplying a password, the request should fail", async () => {
      const accessToken = await testHelper.getUserAccessToken(testUsers[0].id);

      await testMissingField({
        clientFunction: testHelper.client.post.bind(testHelper.client),
        accessToken: accessToken,
        endpoint: "/v1/users",
        data: defaultTestUser,
        testFieldKey: "password"
      })
    })

    test("When not supplying a displayName, the request should fail", async () => {
      const accessToken = await testHelper.getUserAccessToken(testUsers[0].id);

      await testMissingField({
        clientFunction: testHelper.client.post.bind(testHelper.client),
        accessToken: accessToken,
        endpoint: "/v1/users",
        data: defaultTestUser,
        testFieldKey: "displayName"
      })
    })
  })

  describe("Forbidden Fields", () => {
    test("When passing an ID field, the request should fail", async () => {
      const newUser = {
        ...defaultTestUser,
        id: "a78a9859-314e-44ec-8701-f0c869cfc07f"
      }

      const {body, statusCode} = await testHelper.client
        .post("/v1/users")
        .send(newUser);

      expectBadRequest(body, statusCode);
    })

    test("When passing a createdAt field, the request should fail", async () => {
      const newUser = {
        ...defaultTestUser,
        createdAt: "2022-07-11T18:20:32.482Z"
      }

      const {body, statusCode} = await testHelper.client
        .post("/v1/users")
        .send(newUser);

      expectBadRequest(body, statusCode);
    })

    test("When passing an updatedAt field, the request should fail", async () => {
      const newUser = {
        ...defaultTestUser,
        updatedAt: "2022-07-11T18:20:32.482Z"
      }

      const {body, statusCode} = await testHelper.client
        .post("/v1/users")
        .send(newUser);

      expectBadRequest(body, statusCode);
    })

    test("When passing an isVerified field, the request should fail", async () => {
      const newUser = {
        ...defaultTestUser,
        isVerified: true
      }

      const {body, statusCode} = await testHelper.client
        .post("/v1/users")
        .send(newUser);

      expectBadRequest(body, statusCode);
    })

    test("When passing a role field, the request should fail", async () => {
      const newUser = {
        ...defaultTestUser,
        role: "admin"
      }

      const {body, statusCode} = await testHelper.client
        .post("/v1/users")
        .send(newUser);

      expectBadRequest(body, statusCode);
    })
  })

  describe("Invalid Data", () => {
    test("When supplying invalid JSON data, the request should fail", async () => {
      const accessToken = await testHelper.getUserAccessToken(testUsers[0].id);

      await testMalformedData({
        clientFunction: testHelper.client.post.bind(testHelper.client),
        accessToken: accessToken,
        endpoint: "/v1/users"
      })
    })

    describe("When not supplying email as a string, the request should fail", () => {
        testInvalidDataTypes({
          testHelper: testHelper,
          req: {
            clientMethod: "post",
            endpoint: "/v1/users",
            initialData: defaultTestUser
          },
          auth: {
            userId: testUsers[0].id
          },
          testFieldKey: "email",
          testCases: [1, 1.5, true, null, undefined, {test: "yes"}, [1, 2]]
        })
    })

    describe("When not supplying password as a string, the request should fail", () => {
      testInvalidDataTypes({
        testHelper: testHelper,
        req: {
          clientMethod: "post",
          endpoint: "/v1/users",
          initialData: defaultTestUser
        },
        auth: {
          userId: testUsers[0].id
        },
        testFieldKey: "password",
        testCases: [1, 1.5, true, null, undefined, {test: "yes"}, [1, 2]]
      })
    })

    describe("When not supplying displayName as a string, the request should fail", () => {
      testInvalidDataTypes({
        testHelper: testHelper,
        req: {
          clientMethod: "post",
          endpoint: "/v1/users",
          initialData: defaultTestUser
        },
        auth: {
          userId: testUsers[0].id
        },
        testFieldKey: "displayName",
        testCases: [1, 1.5, true, null, undefined, {test: "yes"}, [1, 2]]
      })
    })
  })

  // todo: write registration enabled data for /v1/users [POST]
  // describe("Registration Status", () => {
  //   test("When registration is enabled, adding a new user should succeed", async () => {
  //     // todo: populate test
  //     expect(true).toEqual(false);
  //   })
  //
  //   test("When registration is disabled, adding a new user should fail", async () => {
  //     // todo: populate test
  //     expect(true).toEqual(false);
  //   })
  // })
})

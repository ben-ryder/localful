import {TestHelper} from "../../../../tests/e2e/test-helper";
import {testUsers} from "../../../../tests/test-data/test-data";
import {ConfigService} from "../../../services/config/config";
import {sign} from "jsonwebtoken";
import {expectUnauthorized} from "../../../../tests/e2e/common-expects/expect-unauthorized";
import {ErrorIdentifiers} from "@ben-ryder/lfb-common";
import {expectBadRequest} from "../../../../tests/e2e/common-expects/expect-bad-request";
import {testInvalidDataTypes} from "../../../../tests/e2e/common-expects/test-invalid-data-types";

// todo: add data that revoked tokens actually are revoked and no longer work (when some are expired and some not)!!!!!


describe("Revoke Auth",() => {
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
    test("When a valid refresh & access token a supplied, they should be revoked", async () => {
      const tokenPair  = testHelper.getUserTokens(testUsers[0]);

      // Revoke the tokens, check that request succeeded
      const {statusCode: revokeStatusCode, body} = await testHelper.client
        .post("/v1/auth/revoke")
        .send(tokenPair);
      expect(revokeStatusCode).toEqual(200);

      // Check that the refresh token has been revoked
      const {statusCode: refreshStatusCode} = await testHelper.client
        .post("/v1/auth/refresh")
        .send({refreshToken: tokenPair.refreshToken});
      expect(refreshStatusCode).toEqual(401);

      // Check that the access token has been revoked
      const {statusCode: accessStatusCode} = await testHelper.client
        .get("/v1/auth/check")
        .set("Authorization", `Bearer ${tokenPair.accessToken}`)
      expect(accessStatusCode).toEqual(401);
    })

    test("When a valid refresh token is supplied, it should be revoked", async () => {
      const { refreshToken }  = testHelper.getUserTokens(testUsers[0]);

      // Revoke the token, check that request succeeded
      const {statusCode: revokeStatusCode, body} = await testHelper.client
        .post("/v1/auth/revoke")
        .send({refreshToken});
      expect(revokeStatusCode).toEqual(200);

      // Check that the refresh token has been revoked
      const {statusCode: refreshStatusCode} = await testHelper.client
        .post("/v1/auth/refresh")
        .send({refreshToken});
      expect(refreshStatusCode).toEqual(401);
    })

    test("When a valid access token is supplied, it should be revoked", async () => {
      const { accessToken }  = testHelper.getUserTokens(testUsers[0]);

      // Revoke the token, check that request succeeded
      const {statusCode: revokeStatusCode, body} = await testHelper.client
        .post("/v1/auth/revoke")
        .send({accessToken});
      expect(revokeStatusCode).toEqual(200);

      // Check that the access token has been revoked
      const {statusCode: accessStatusCode} = await testHelper.client
        .get("/v1/auth/check")
        .set("Authorization", `Bearer ${accessToken}`)
      expect(accessStatusCode).toEqual(401);
    })
  })

  describe("Invalid/Expired Tokens", () => {
    test("When an expired refresh token is supplied, the request should still succeed", async () => {
      const configService = testHelper.app.get(ConfigService);

      const refreshToken = sign(
        {userId: testUsers[0].id, type: "refreshToken"},
        configService.config.auth.refreshToken.secret,
        {expiresIn: 0}
      );

      const {body, statusCode} = await testHelper.client
        .post("/v1/auth/revoke")
        .send({
          refreshToken
        });

      expect(statusCode).toEqual(200);
    })

    test("When an expired access token is supplied, the request should still succeed", async () => {
      const configService = testHelper.app.get(ConfigService);

      const accessToken = sign(
        {userId: testUsers[0].id, type: "accessToken"},
        configService.config.auth.accessToken.secret,
        {expiresIn: 0}
      );

      const {body, statusCode} = await testHelper.client
        .post("/v1/auth/revoke")
        .send({
          accessToken
        });

      expect(statusCode).toEqual(200);
    })

    test("When an incorrectly signed refresh token is supplied, the request should fail", async () => {
      //  Create a token with the expected payload but signed wrong
      const refreshToken = sign(
        {userId: testUsers[0].id, type: "refreshToken"},
        "aergsethsrjsrj",
        {expiresIn: "1h"}
      );

      const {body, statusCode} = await testHelper.client
        .post("/v1/auth/revoke")
        .send({
          refreshToken
        });

      expectUnauthorized(body, statusCode, ErrorIdentifiers.AUTH_TOKEN_INVALID);
    })

    test("When an invalid refresh token is supplied, the request should fail", async () => {
      const {body, statusCode} = await testHelper.client
        .post("/v1/auth/revoke")
        .send({
          refreshToken: "dagablejg"
        });

      expectBadRequest(body, statusCode);
    })

    test("When an incorrectly signed access token is supplied, the request should fail", async () => {
      //  Create a token with the expected payload but signed wrong
      const accessToken = sign(
        {userId: testUsers[0].id, type: "accessToken"},
        "aergsethsrjsrj",
        {expiresIn: "1h"}
      );

      const {body, statusCode} = await testHelper.client
        .post("/v1/auth/revoke")
        .send({
          accessToken
        });

      expectUnauthorized(body, statusCode, ErrorIdentifiers.AUTH_TOKEN_INVALID);
    })

    test("When an invalid access token is supplied, the request should fail", async () => {
      const {body, statusCode} = await testHelper.client
        .post("/v1/auth/revoke")
        .send({
          accessToken: "dagablejg"
        });

      expectBadRequest(body, statusCode);
    })

    test("When a valid access token but incorrectly singed refresh token is supplied, the request should fail", async () => {
      const { accessToken } = testHelper.getUserTokens(testUsers[0]);

      //  Create a token with the expected payload but signed wrong
      const refreshToken = sign(
        {userId: testUsers[0].id, type: "refreshToken"},
        "aergsethsrjsrj",
        {expiresIn: "1h"}
      );

      const {body, statusCode} = await testHelper.client
        .post("/v1/auth/revoke")
        .send({
          refreshToken,
          accessToken
        });

      expectUnauthorized(body, statusCode, ErrorIdentifiers.AUTH_TOKEN_INVALID);
    })

    test("When a valid refresh token but incorrectly singed access token is supplied, the request should fail", async () => {
      const { refreshToken } = testHelper.getUserTokens(testUsers[0]);

      //  Create a token with the expected payload but signed wrong
      const accessToken = sign(
        {userId: testUsers[0].id, type: "accessToken"},
        "aergsethsrjsrj",
        {expiresIn: "1h"}
      );

      const {body, statusCode} = await testHelper.client
        .post("/v1/auth/revoke")
        .send({
          refreshToken,
          accessToken
        });

      expectUnauthorized(body, statusCode, ErrorIdentifiers.AUTH_TOKEN_INVALID);
    })

    test("When a valid access token but expired refresh token is supplied, the request should still succeed", async () => {
      const configService = testHelper.app.get(ConfigService);
      const { accessToken } = testHelper.getUserTokens(testUsers[0]);

      const refreshToken = sign(
        {userId: testUsers[0].id, type: "refreshToken"},
        configService.config.auth.refreshToken.secret,
        {expiresIn: 0}
      );

      const {statusCode} = await testHelper.client
        .post("/v1/auth/revoke")
        .send({
          refreshToken,
          accessToken
        });

      expect(statusCode).toEqual(200);
    })

    test("When a valid refresh token but expired access token is supplied, the request should still succeed", async () => {
      const configService = testHelper.app.get(ConfigService);
      const { refreshToken } = testHelper.getUserTokens(testUsers[0]);

      const accessToken = sign(
        {userId: testUsers[0].id, type: "accessToken"},
        configService.config.auth.accessToken.secret,
        {expiresIn: 0}
      );

      const {statusCode} = await testHelper.client
        .post("/v1/auth/revoke")
        .send({
          refreshToken,
          accessToken
        });

      expect(statusCode).toEqual(200);
    })
  })

  describe("Invalid Data", () => {
    describe("When not supplying accessToken as a string, the request should fail", () => {
      testInvalidDataTypes({
        testHelper: testHelper,
        clientMethod: "post",
        user: testUsers[0],
        endpoint: "/v1/auth/revoke",
        data: {},
        testFieldKey: "accessToken",
        testCases: [1, 1.5, true, {test: "yes"}, [1, 2]]
      })
    })

    describe("When not supplying refreshToken as a string, the request should fail", () => {
      testInvalidDataTypes({
        testHelper: testHelper,
        clientMethod: "post",
        user: testUsers[0],
        endpoint: "/v1/auth/revoke",
        data: {},
        testFieldKey: "refreshToken",
        testCases: [1, 1.5, true, {test: "yes"}, [1, 2]]
      })
    })
  })
})

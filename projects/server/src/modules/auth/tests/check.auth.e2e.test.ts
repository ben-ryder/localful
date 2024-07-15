import {sign} from "jsonwebtoken";
import {ConfigService} from "../../../services/config/config";
import {TestHelper} from "../../../../testing/test-helper";
import {expectUnauthorized} from "../../../../testing/common/expect-unauthorized";
import {testUser1} from "../../../../testing/data/users";


describe("Check Auth",() => {
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

  test("When authenticated, the request should succeed", async () => {
    const accessToken = await testHelper.getUserAccessToken(testUser1.id);

    const {statusCode} = await testHelper.client
      .get("/v1/auth/check")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(statusCode).toEqual(200);
  })

  test("When not authenticated, the request should fail", async () => {
    const {body, statusCode} = await testHelper.client
      .get("/v1/auth/check")

    expectUnauthorized(body, statusCode);
  })

  test("When supplying an incorrectly signed accessToken, the request should fail", async () => {
    const accessToken = sign(
      {type: "accessToken", userId: testUser1.id, role: testUser1.role},
      "qethwrthwrthr",
      {expiresIn: "1hr"}
    );

    const {body, statusCode} = await testHelper.client
      .get("/v1/auth/check")
      .set("Authorization", `Bearer ${accessToken}`)

    expectUnauthorized(body, statusCode);
  })

  test("When supplying an invalid accessToken, the request should fail", async () => {
    const {body, statusCode} = await testHelper.client
      .get("/v1/auth/check")
      .set("Authorization", "Bearer SWFubawgrlkx")

    expectUnauthorized(body, statusCode);
  })

  test("When supplying an expired accessToken, the request should fail", async () => {
    const configService = testHelper.app.get(ConfigService);

    const accessToken = sign(
      {type: "accessToken", userId: testUser1.id, role: testUser1.role},
      configService.config.auth.accessToken.secret,
      {expiresIn: 0}
    );

    const {body, statusCode} = await testHelper.client
      .get("/v1/auth/check")
      .set("Authorization", `Bearer ${accessToken}`)

    expectUnauthorized(body, statusCode);
  })
})

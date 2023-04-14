import {expectBadRequest} from "./expect-bad-request";
import {TestHelper} from "../test-helper";

export interface TestInvalidDataTypesConfig {
  testFieldKey: string,
  testCases: any[],
  req: {
    clientMethod: "get" | "post" | "patch" | "delete",
    endpoint: string,
    initialData: object,
  },
  auth: {
    userId: string,
    scopes: string[]
  },
  testHelper: TestHelper
}

export function testInvalidDataTypes(config: TestInvalidDataTypesConfig) {
  test.each(config.testCases)(`When ${config.testFieldKey} is %s, Then response should be 'HTTP 400 - bad request'`, async testCase => {
    const testData = {
      ...config.req.initialData,
      [config.testFieldKey]: testCase
    };

    const accessToken = await config.testHelper.getUserAccessToken(config.auth.userId, config.auth.scopes);

    const {body, statusCode} = await config.testHelper.client[config.req.clientMethod](config.req.endpoint)
      .set("Authorization", `Bearer ${accessToken}`)
      .send(testData);

    expectBadRequest(body, statusCode);
  })
}

import {expectBadRequest} from "./expect-bad-request";
import {TestHelper} from "../test-helper";

export interface TestInvalidDataTypesConfig {
  testHelper: TestHelper,
  clientMethod: "get" | "post" | "patch" | "delete",
  endpoint: string,
  userId: string,
  scopes: string[]
  data: object,
  testFieldKey: string,
  testCases: any[]
}

export function testInvalidDataTypes(config: TestInvalidDataTypesConfig) {
  test.each(config.testCases)(`When ${config.testFieldKey} is %s, the request should fail`, async testCase => {
    const testData = {
      ...config.data,
      [config.testFieldKey]: testCase
    };

    const accessToken = await config.testHelper.getUserAccessToken(config.userId, config.scopes);

    const {body, statusCode} = await config.testHelper.client[config.clientMethod](config.endpoint)
      .set("Authorization", `Bearer ${accessToken}`)
      .send(testData);

    expectBadRequest(body, statusCode);
  })
}

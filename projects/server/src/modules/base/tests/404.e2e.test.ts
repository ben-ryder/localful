import {TestHelper} from "../../../../tests-utils/test-helper";
import {ErrorIdentifiers} from "@ben-ryder/lfb-common";
import {HttpStatus} from "@nestjs/common";


describe("Generic 404 Response",() => {
  const testHelper = new TestHelper();

  beforeAll(async () => {
    await testHelper.beforeAll();
  });
  afterAll(async () => {
    await testHelper.afterAll()
  });
  beforeEach(async () => {
    await testHelper.beforeEach()
  });

  describe("/random-route [GET, POST, PATCH, DELETE]", () => {
    test("When a GET request is made to a random route, Then the response should be a '404 - not found'", async () => {
      const {body, statusCode} = await testHelper.client.get("/random-route");

      expect(statusCode).toEqual(HttpStatus.NOT_FOUND);
      expect(body).toHaveProperty("identifier");
      expect(body.identifier).toEqual(ErrorIdentifiers.RESOURCE_NOT_FOUND);
    })

    test("When a POST request is made to a random route, Then the response should be a '404 - not found'", async () => {
      const {body, statusCode} = await testHelper.client.post("/random-route");

      expect(statusCode).toEqual(HttpStatus.NOT_FOUND);
      expect(body).toHaveProperty("identifier");
      expect(body.identifier).toEqual(ErrorIdentifiers.RESOURCE_NOT_FOUND);
    })

    test("When a PATCH request is made to a random route, Then the response should be a '404 - not found'", async () => {
      const {body, statusCode} = await testHelper.client.patch("/random-route");

      expect(statusCode).toEqual(HttpStatus.NOT_FOUND);
      expect(body).toHaveProperty("identifier");
      expect(body.identifier).toEqual(ErrorIdentifiers.RESOURCE_NOT_FOUND);
    })

    test("When a DELETE request is made to a random route, Then the response should be a '404 - not found'", async () => {
      const {body, statusCode} = await testHelper.client.delete("/random-route");

      expect(statusCode).toEqual(HttpStatus.NOT_FOUND);
      expect(body).toHaveProperty("identifier");
      expect(body.identifier).toEqual(ErrorIdentifiers.RESOURCE_NOT_FOUND);
    })
  })
})

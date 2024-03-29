import {HttpStatus} from "@nestjs/common";
import {ErrorIdentifiers} from "@localful/common";

export function expectForbidden(body: any, statusCode: any, identifier: string = ErrorIdentifiers.ACCESS_FORBIDDEN) {
  expect(statusCode).toEqual(HttpStatus.FORBIDDEN);
  expect(body).toHaveProperty("identifier");
  expect(body.identifier).toEqual(identifier);
}

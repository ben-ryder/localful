import {ErrorIdentifiers} from "@localful/common";
import {HttpStatus} from "@nestjs/common";

export function expectUnauthorized(body: any, statusCode: any, identifier: string = ErrorIdentifiers.ACCESS_UNAUTHORIZED) {
  expect(statusCode).toEqual(HttpStatus.UNAUTHORIZED);
  expect(body).toHaveProperty("identifier");
  expect(body.identifier).toEqual(identifier);
}
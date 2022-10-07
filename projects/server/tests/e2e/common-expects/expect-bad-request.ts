import {HttpStatus} from "@nestjs/common";
import {ErrorIdentifiers} from "../../../src/common/errors/error-identifiers";



export function expectBadRequest(body: any, statusCode: any, identifier: any = ErrorIdentifiers.USER_REQUEST_INVALID) {
  expect(statusCode).toEqual(HttpStatus.BAD_REQUEST);
  expect(body).toEqual(expect.objectContaining({
    identifier: identifier
  }))
}

import {HttpStatus} from "@nestjs/common";
import {ErrorIdentifiers} from "@ben-ryder/lfb-common";

export function expectNotFound(body: any, statusCode: any, identifier: any = ErrorIdentifiers.NOT_FOUND) {
  expect(statusCode).toEqual(HttpStatus.NOT_FOUND);
  expect(body).toEqual(expect.objectContaining({
    identifier: identifier
  }))
}

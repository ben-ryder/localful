import {HttpStatus} from "@nestjs/common";
import {ErrorIdentifiers} from "@ben-ryder/lfb-common";


export function expectBadRequest(body: any, statusCode: any, identifier: any = ErrorIdentifiers.REQUEST_INVALID) {
  expect(statusCode).toEqual(HttpStatus.BAD_REQUEST);
  expect(body).toEqual(expect.objectContaining({
    identifier: identifier
  }))
}

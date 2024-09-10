import {NextFunction, Response, Request} from "express";

import {BaseError} from "@services/errors/base/base.error.js";
import {errorHttpMapping, fallbackMapping} from "./error-http-mappings.js";


export async function httpErrorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  const errorName = err.constructor.name;

  const httpCode = errorHttpMapping[errorName]?.statusCode || fallbackMapping.statusCode;
  let message = fallbackMapping.defaultMessage;
  let identifier = fallbackMapping.identifier;

  if (err instanceof BaseError) {
    if (err.applicationMessage) {
      message = err.applicationMessage;
    }
    else if (errorHttpMapping[errorName]?.defaultMessage) {
      message = errorHttpMapping[errorName].defaultMessage;
    }

    if (err.identifier) {
      identifier = err.identifier;
    }
    else if (errorHttpMapping[errorName]?.identifier) {
      identifier = errorHttpMapping[errorName].identifier;
    }
  }

  // todo: add logging/alerting on server errors?

  return res.status(httpCode).send({
    identifier: identifier,
    statusCode: httpCode,
    message: message,
  });
}

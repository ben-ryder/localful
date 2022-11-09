import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
} from "@nestjs/common";
import { Response } from "express";
import { BaseError } from "./base/base.error";
import { fallbackMapping, errorHttpMapping } from "./error-http-mappings";

@Catch(BaseError)
export class ErrorFilter implements ExceptionFilter {
  catch(error: BaseError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    return this.sendErrorResponse(error, response);
  }

  async sendErrorResponse(err: Error, res: Response) {
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

    return res.status(httpCode).send({
      identifier: identifier,
      statusCode: httpCode,
      message: message,
    });
  }
}

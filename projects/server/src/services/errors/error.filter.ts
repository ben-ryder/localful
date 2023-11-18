import {
  ExceptionFilter,
  Catch,
  ArgumentsHost, HttpException, HttpStatus,
} from "@nestjs/common";
import { Response } from "express";
import { BaseError } from "./base/base.error";
import { fallbackMapping, errorHttpMapping } from "./error-http-mappings";
import {ErrorIdentifiers} from "@localful/common";

@Catch(BaseError, HttpException)
export class ErrorFilter implements ExceptionFilter {
  catch(error: BaseError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    return this.sendErrorResponse(error, response);
  }

  async sendErrorResponse(err: Error, res: Response) {
    const errorName = err.constructor.name;

    // Intercept NestJS errors to handle 404, otherwise fallback to NestJS formatted response.
    if (err instanceof HttpException) {
      if (errorName === "NotFoundException") {
        return res.status(HttpStatus.NOT_FOUND).send({
          identifier: ErrorIdentifiers.NOT_FOUND,
          statusCode: HttpStatus.NOT_FOUND,
          message: "The route you requested could not be found.",
        });
      }
      else {
        return res.status(err.getStatus()).send({
          statusCode: err.getStatus(),
          message: err.getResponse(),
        });
      }
    }

    // Process custom errors
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

    // todo: add logging/alerting on errors?

    return res.status(httpCode).send({
      identifier: identifier,
      statusCode: httpCode,
      message: message,
    });
  }
}

import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
} from "@nestjs/common";
import { BaseError } from "./base/base.error";
import { fallbackMapping, errorHttpMapping } from "./error-http-mappings";
import {Socket} from "socket.io";

@Catch(BaseError)
export class GatewayErrorFilter implements ExceptionFilter {
  catch(error: BaseError, host: ArgumentsHost) {
    const socket = host.switchToWs().getClient<Socket>();
    return this.sendSocketErrorAcknowledgement(error, socket);
  }

  async sendSocketErrorAcknowledgement(err: Error, socket: Socket) {
    const errorName = err.constructor.name;
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

    return {
      error: true,
      identifier: identifier,
      message: message,
    };
  }
}

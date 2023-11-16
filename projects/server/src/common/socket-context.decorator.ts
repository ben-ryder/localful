import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { Socket } from "socket.io";
import {RequestContext} from "./request-context.decorator.js";

/**
 * There is no absolute guarantee that the context will
 * be processed for every route, so null must be an option.
 */
export interface SocketWithContext extends Socket {
  context: RequestContext | null;
}

// todo: is this context decorator needed?
export const SocketContext = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): RequestContext => {
    const request = ctx.switchToHttp().getRequest();
    return request.context;
  },
);

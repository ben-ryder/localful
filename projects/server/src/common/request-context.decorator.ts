import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { Request } from "express";

/**
 * The user context may be nothing in the case of an anonymous request, hence null is an option.
 */
export type UserContext = {id: string} | null;

export interface RequestContext {
  user: UserContext
}

/**
 * There is no absolute guarantee that the context will
 * be processed for every route, so null must be an option.
 */
export interface RequestWithContext extends Request {
  context: RequestContext | null;
}

export const RequestContext = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): RequestContext => {
    const request = ctx.switchToHttp().getRequest();
    return request.context;
  },
);

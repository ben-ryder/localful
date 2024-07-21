import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { Request } from "express";

/**
 * User details to be included in the request.
 */
export interface RequestUser {
  id: string;
  verifiedAt: string | null;
  permissions: string[]
}

/**
 * The user context may be nothing in the case of an anonymous request, hence null is an option.
 */
export type UserContext = RequestUser;

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

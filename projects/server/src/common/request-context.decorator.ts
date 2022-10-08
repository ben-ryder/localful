import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { Request } from "express";

export interface RequestUser {
  id: string;
  isVerified: boolean
}

export interface RequestContext {
  user: RequestUser;
}

export interface RequestWithContext extends Request {
  context: RequestContext;
}

export const RequestContext = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): RequestContext => {
    const request = ctx.switchToHttp().getRequest();
    return request.context;
  },
);

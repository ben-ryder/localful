import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export interface RequestUser {
  id: string;
  isVerified: boolean
}

export interface RequestContext {
  user: RequestUser;
}

export const RequestContext = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): RequestContext => {
    const request = ctx.switchToHttp().getRequest();
    return request.context;
  },
);

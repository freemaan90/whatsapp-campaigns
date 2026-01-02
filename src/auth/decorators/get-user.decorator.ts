
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayload } from '../jwt-payload';

export const GetUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user as JwtPayload;
  },
);

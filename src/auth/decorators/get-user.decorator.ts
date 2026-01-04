
// auth/decorators/get-user.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { JwtPayload } from '../jwt-payload';

export const GetUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): JwtPayload => {
    const request = ctx.switchToHttp().getRequest();
    // Passport setea req.user con lo que retorna JwtStrategy.validate
    return request.user as JwtPayload;
  },
);


// jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from './jwt-payload';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET, // Debe coincidir con la firma del token
      // Si al firmar usaste issuer/audience, añádelos también aquí:
      // issuer: process.env.JWT_ISSUER,
      // audience: process.env.JWT_AUDIENCE,
    });
  }

    async validate(payload: JwtPayload) {
    // Recomendado: devolver el payload completo
    return payload;

    // Alternativa: map explícito
    // return { sub: payload.sub, email: payload.email };
  }
}
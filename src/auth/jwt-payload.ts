
// auth/jwt-payload.ts
export interface JwtPayload {
    sub: number;     // user id
    email: string;
    // otros claims (roles, permisos, etc.)
  }
  
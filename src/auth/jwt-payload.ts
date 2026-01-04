
// auth/jwt-payload.ts
export interface JwtPayload {
  sub: number;        // id del usuario
  email: string;
  // otros claims opcionales: roles, permissions, etc.
}

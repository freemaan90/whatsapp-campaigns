import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly users: UserService,
    private readonly jwt: JwtService,
  ) { }

  async validateUser(email: string, password: string) {
    const user = await this.users.findByEmail(email);
    if (!user) throw new UnauthorizedException("Usuario no encontrado");

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new UnauthorizedException("Contraseña incorrecta");

    // Quitar el password del objeto antes de retornarlo
    const { password: _password, ...safeUser } = user;

    return safeUser;
  }

  async login(username: string, password: string) {
    const user = await this.validateUser(username, password);

    const payload = { sub: user.id, username: user.email };
    
    return {
      access_token: this.jwt.sign(payload),
      user,
    };
  }
}
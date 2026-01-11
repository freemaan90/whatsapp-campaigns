
// auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entitys/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(User) private readonly usersRepo: Repository<User>,
  ) {}

  async validateUser(email: string, plainPassword: string) {
    const user = await this.usersRepo.findOne({
      where: { email: email.toLowerCase().trim() },
      relations: { contact: true, location: true, whatsapp: true },
      // ⚠️ Si password tiene select:false en la entidad, incluilo explícitamente:
      select: [
        'id',
        'email',
        'password',
        'firstName',
        'lastName',
        'phone',
      ],
    });

    if (!user) throw new UnauthorizedException('Invalid credentials');

    const ok = await bcrypt.compare(plainPassword, user.password);
    if (!ok) throw new UnauthorizedException('Invalid credentials');

    return user;
  }

  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);

    const payload = { sub: user.id, email: user.email };
    const access_token = await this.jwtService.signAsync(payload);

    // retornar usuario seguro (sin password)
    const safeUser = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      contact: user.contact ?? null,
      location: user.location ?? null,
      whatsapp: user.whatsapp ?? null,
    };
    console.log(safeUser);
    
    return { access_token, user: safeUser };
  }
}

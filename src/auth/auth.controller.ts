
// auth.controller.ts
import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from '../user/user.service';
import type { JwtPayload } from './jwt-payload';
import { GetUser } from './decorators/get-user.decorator';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  // 👉 LOGIN (necesario para tu front)
  @Post('login')
  async login(@Body() body: LoginDto) {
    // Retorna: { access_token, user }
    return this.authService.login(body.email, body.password);
  }

  // 👉 PERFIL PROTEGIDO
  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  async me(@GetUser() user: JwtPayload) {
    const userId = user.sub;
    return this.userService.findProfileById(userId);
  }
}

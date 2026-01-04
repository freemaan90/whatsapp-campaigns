import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserService } from 'src/user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { JwtModule } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from 'src/user/user.module';
import { JwtStrategy } from './jwt.strategy';
@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      inject:[ConfigService],
      useFactory:(config: ConfigService) => ({
      secret: config.get<string>('JWT_SECRET'),
      signOptions: { expiresIn: "1d" },
      })
    }),
    UserModule
  ],
  controllers: [AuthController],
  providers: [AuthService,UserService,JwtStrategy],
  exports:[PassportModule,JwtModule]
})
export class AuthModule {}

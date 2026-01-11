import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpRequestModule } from 'src/http-request/http-request.module';
import { User } from './entitys/user.entity';
import { Contact } from 'src/contact/contact.entity';
import { WhatsApp } from './entitys/whatsapp.entity';
import { UserService } from './user.service';
import { Location } from 'src/location/location.entity';

@Module({
  imports: [
    HttpRequestModule,
    TypeOrmModule.forFeature([User, Contact, Location, WhatsApp]),
  ],
  providers: [UserService],
  exports: [UserService, TypeOrmModule],
})
export class UserModule {}

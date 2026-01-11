import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { HttpRequestModule } from 'src/http-request/http-request.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entitys/user.entity';
import { Contact } from 'src/contact/contact.entity';
import { Location } from 'src/location/location.entity';
import { WhatsApp } from './entitys/whatsapp.entity';

@Module({
  imports:[
    HttpRequestModule,
    TypeOrmModule.forFeature([User, Contact,Location, WhatsApp])
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}

import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { HttpRequestModule } from 'src/http-request/http-request.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Contact } from 'src/contact/contact.entity';
import { Location } from 'src/location/location.entity';

@Module({
  imports:[
    HttpRequestModule,
    TypeOrmModule.forFeature([User, Contact,Location])
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}

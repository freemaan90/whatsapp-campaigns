import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { NewUserDto } from './dto/new-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Post()
  async newUser(@Body() newUserDto: NewUserDto) {
    return await this.usersService.create(newUserDto);
  }
}

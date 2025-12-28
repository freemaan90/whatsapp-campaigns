import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { NewUserDto } from './dto/new-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post()
  async newUser(@Body() newUserDto: NewUserDto) {
    return await this.userService.create(newUserDto);
  }
}

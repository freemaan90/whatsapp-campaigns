import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { NewUserDto } from './dto/new-user.dto';
import { BussinesPhoneDto } from './dto/bussines-phone.dto';
import { WabaIdDto } from './dto/waba-id.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async newUser(@Body() newUserDto: NewUserDto) {
    return await this.userService.create(newUserDto);
  }

  @Patch(`:id/bussines_phone`)
  async bussinesPhone(@Param('id') id: number, @Body() dto: BussinesPhoneDto) {
    return await this.userService.updateBussinesPhone(id, dto);
  }

  @Patch(`:id/waba_id`)
  async wabaId(@Param('id') id: number, @Body() dto: WabaIdDto) {
    return await this.userService.updateWabaId(id, dto);
  }

  @Delete(':id/bussinesPhone')
  deleteCompany(@Param('id') id: number) {
    return this.userService.deleteBussinesPhone(id);
  }

  @Delete(':id/wabaId')
  deleteWabaId(@Param('id') id: number) {
    return this.userService.deleteWabaId(id);
  }
}

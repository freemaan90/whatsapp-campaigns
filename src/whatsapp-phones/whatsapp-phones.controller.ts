import { Body, Controller, Get, Post } from '@nestjs/common';
import { WhatsappPhonesService } from './whatsapp-phones.service';
import { RegisterNewPhoneDto } from './dto/register-new-phone.dto';
import { DeregisterPhoneDto } from './dto/deregister-phone.dto';
import { RequestVerificationCodeDto } from './dto/request-verification-code.dto';
import { VerificationCodeDto } from './dto/verification-code.dto';

@Controller('whatsapp-phones')
export class WhatsappPhonesController {
  constructor(private readonly whatsappPhonesService: WhatsappPhonesService) {}

  @Get(`get-all-phones`)
  async getPhoneNumbers() {
    return this.whatsappPhonesService.getAllPhones();
  }

  @Post(`register-new-phone`)
  async registerNewPhone(@Body() { sixDigitPin }: RegisterNewPhoneDto) {
    return this.whatsappPhonesService.registerNewPhone(sixDigitPin);
  }

  @Post(`deregister-phone`)
  async deregisterPhone(@Body() { phoneNumberId }: DeregisterPhoneDto) {
    return this.whatsappPhonesService.deregisterPhone(phoneNumberId);
  }

  @Post(`register-verification-code`)
  async reguestVerificationCode(
    @Body() { phoneNumberId }: RequestVerificationCodeDto,
  ) {
    return this.whatsappPhonesService.requestVerificationCode({phoneNumberId});
  }

  @Post(`verify-code`)
  async verifyCode(@Body() { code, phoneNumberId }: VerificationCodeDto) {
    return this.whatsappPhonesService.verificationCode({ code, phoneNumberId });
  }

  @Post('set-two-step-verification-code')
  async setTwoStepVerificationCode({ code, phoneNumberId }: VerificationCodeDto){
    return this.whatsappPhonesService.setTwoStepVerificationCode({ code, phoneNumberId })
  }
}

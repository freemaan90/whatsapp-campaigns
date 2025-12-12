import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpRequestService } from 'src/http-request/http-request.service';
import { RequestVerificationCodeDto } from './dto/request-verification-code.dto';
import { VerificationCodeDto } from './dto/verification-code.dto';

@Injectable()
export class WhatsappPhonesService {
  constructor(
    private configService: ConfigService,
    private readonly httpRequest: HttpRequestService,
  ) {}
  async getAllPhones() {
    const url = `${this.configService.get('BASE_URL')}/${this.configService.get('WABA-ID')}/phone_numbers`;
    const headers = {
      Authorization: `Bearer ${this.configService.get('API_TOKEN')}`,
    };
    return this.httpRequest.get(url, headers);
  }

  async registerNewPhone(sixDigitPin: string) {
    const url = `${this.configService.get('BASE_URL')}/${this.configService.get('WABA-ID')}/register`;
    const headers = {
      Authorization: `Bearer ${this.configService.get('API_TOKEN')}`,
    };
    const data = {
      messaging_product: 'whatsapp',
      pin: sixDigitPin,
    };
    return this.httpRequest.post(url, data, headers);
  }

  async deregisterPhone(phoneNumberId: string) {
    const url = `${this.configService.get('BASE_URL')}/${phoneNumberId}/deregister`;
    const headers = {
      Authorization: `Bearer ${this.configService.get('API_TOKEN')}`,
    };

    return this.httpRequest.post(url, {}, headers);
  }

  async requestVerificationCode({ phoneNumberId }: RequestVerificationCodeDto) {
    const url = `${this.configService.get('BASE_URL')}/${this.configService.get('VERSION')}/${phoneNumberId}/request_code`;
    const headers = {
      Authorization: `Bearer ${this.configService.get('API_TOKEN')}`,
    };
    const data = {
      code_method: 'SMS',
      locale: 'en_US',
    };
    return this.httpRequest.post(url, data, headers);
  }

  async verificationCode({ code, phoneNumberId }: VerificationCodeDto) {
    const url = `${this.configService.get('BASE_URL')}/${this.configService.get('VERSION')}/${phoneNumberId}/verify_code`;
    const headers = {
      Authorization: `Bearer ${this.configService.get('API_TOKEN')}`,
    };

    return this.httpRequest.post(url, { code }, headers);
  }

  async setTwoStepVerificationCode({
    code,
    phoneNumberId,
  }: VerificationCodeDto) {
    const url = `${this.configService.get('BASE_URL')}/${this.configService.get('VERSION')}/${phoneNumberId}`;
    const headers = {
      Authorization: `Bearer ${this.configService.get('API_TOKEN')}`,
    };
    const data = {
      pin: code,
    };

    return this.httpRequest.post(url, data, headers);
  }
}

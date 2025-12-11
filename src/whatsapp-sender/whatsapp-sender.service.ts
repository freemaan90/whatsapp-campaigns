import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpRequestService } from '../http-request/http-request.service';
import { WhatsAppTemplateDto } from './dto/whatsapp-template.dto';
import { MarkAsReadDto } from 'src/whatsapp/dto/mark-as-read.dto';
@Injectable()
export class WhatsappSenderService {
  constructor(
    private configService: ConfigService,
    private readonly httpRequest: HttpRequestService,
  ) {}

  async sendTemplateToWhatsApp(data: WhatsAppTemplateDto) {
    const baseURL = `${this.configService.get('BASE_URL')}/${this.configService.get('API_VERSION')}/${this.configService.get('BUSINESS_PHONE')}/messages`;
    const headers = {
      Authorization: `Bearer ${this.configService.get('API_TOKEN')}`,
    };

    const response = await this.httpRequest.post(baseURL, data, headers);
    return response;
  }
  async sendMarkAsReadToWhatsApp(data: MarkAsReadDto) {
    const baseURL = `${this.configService.get('BASE_URL')}/${this.configService.get('API_VERSION')}/${this.configService.get('BUSINESS_PHONE')}/messages`;
    const headers = {
      Authorization: `Bearer ${this.configService.get('API_TOKEN')}`,
    };

    const response = await this.httpRequest.post(baseURL, data, headers);
    return response;
  }

  async sendToWhatsApp(data: any) {
    const baseURL = `${this.configService.get('BASE_URL')}/${this.configService.get('API_VERSION')}/${this.configService.get('BUSINESS_PHONE')}/messages`;
    const headers = {
      Authorization: `Bearer ${this.configService.get('API_TOKEN')}`,
    };

    return await this.httpRequest.post(baseURL,data,headers)
  }
}

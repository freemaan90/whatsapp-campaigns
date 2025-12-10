import { Injectable } from '@nestjs/common';
import { SendTextMessageDto } from './dto/send-text-message.dto';
import { ConfigService } from '@nestjs/config';
import { HttpRequestService } from 'src/http-request/http-request.service';

@Injectable()
export class WhatsappMessagesService {
  constructor(
    private configService: ConfigService,
    private readonly httpRequest: HttpRequestService,
  ) {}
  async sendTextMessage({to,text}: SendTextMessageDto) {
    const data = {
        messaging_product:'whatsapp',
        recipient_type:'individual',
        to,
        type:'text',
        text:{
            preview_url:false,
            body:text
        }
    }
    const baseURL = `${this.configService.get('BASE_URL')}/v24.0/${this.configService.get('BUSINESS_PHONE')}/messages`;
    const headers = {
      Authorization: `Bearer ${this.configService.get('API_TOKEN')}`,
    };
    return this.httpRequest.post(baseURL, data , headers)
  }
}

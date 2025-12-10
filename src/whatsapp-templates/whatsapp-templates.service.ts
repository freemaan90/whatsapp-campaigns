import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpRequestService } from 'src/http-request/http-request.service';
import { CreateNewTemplateDto } from './dto/create-new-template.dto';

@Injectable()
export class WhatsappTemplatesService {
  constructor(
    private configService: ConfigService,
    private readonly httpRequest: HttpRequestService,
  ) {}
  async getAllTemplates() {
    const baseURL = `${this.configService.get('BASE_URL')}/${this.configService.get('API_VERSION')}/${this.configService.get('WABA-ID')}/message_templates`;
    const headers = {
      Authorization: `Bearer ${this.configService.get('API_TOKEN')}`,
    };
    return await this.httpRequest.get(baseURL, headers);
  }

  async createNewTemplate(data: CreateNewTemplateDto):Promise<{category:string,id:string,status:string}> {
    const baseURL = `${this.configService.get('BASE_URL')}/${this.configService.get('API_VERSION')}/${this.configService.get('WABA-ID')}/message_templates`;
    const headers = {
      Authorization: `Bearer ${this.configService.get('API_TOKEN')}`,
    };
    return await this.httpRequest.post(baseURL,data, headers)
  }
}

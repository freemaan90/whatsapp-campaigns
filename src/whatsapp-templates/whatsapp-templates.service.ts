import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpRequestService } from 'src/http-request/http-request.service';
import { CreateNewTemplateDto } from './dto/create-new-template.dto';
import { DeleteTemplateByIdDto } from './dto/delete-template-by-id.dto';
import { EditTemplateByIdDto } from './dto/edit-template-by-id.dto';

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

  async createNewTemplate(
    data: CreateNewTemplateDto,
  ): Promise<{ category: string; id: string; status: string }> {
    const baseURL = `${this.configService.get('BASE_URL')}/${this.configService.get('API_VERSION')}/${this.configService.get('WABA-ID')}/message_templates`;
    const headers = {
      Authorization: `Bearer ${this.configService.get('API_TOKEN')}`,
    };
    return await this.httpRequest.post(baseURL, data, headers);
  }

  async deleteTemplateById({ HSM_ID, NAME }: DeleteTemplateByIdDto) {
    const baseURL = `${this.configService.get('BASE_URL')}/${this.configService.get('API_VERSION')}/${this.configService.get('WABA-ID')}/message_templates?hsm_id=${HSM_ID}&name=${NAME}`;
    const headers = {
      Authorization: `Bearer ${this.configService.get('API_TOKEN')}`,
    };
    return await this.httpRequest.delete(baseURL, headers);
  }

  async editTemplateById({
    HSM_ID,
    name,
    components,
    language,
    category,
  }: EditTemplateByIdDto) {
    const data = {
      name,
      components,
      language,
      category,
    };
    const baseURL = `${this.configService.get('BASE_URL')}/${this.configService.get('API_VERSION')}/${HSM_ID}`;
    const headers = {
      Authorization: `Bearer ${this.configService.get('API_TOKEN')}`,
    };
    return await this.httpRequest.post(baseURL, data, headers);
  }
}

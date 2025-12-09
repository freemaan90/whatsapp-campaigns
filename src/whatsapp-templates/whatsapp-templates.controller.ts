import { Controller, Get } from '@nestjs/common';
import { WhatsappTemplatesService } from './whatsapp-templates.service';

@Controller('whatsapp-templates')
export class WhatsappTemplatesController {
  constructor(private readonly whatsappTemplatesService: WhatsappTemplatesService) {}

  @Get(`all`)
  getAllTemplates(){
    return this.whatsappTemplatesService.getAllTemplates()
  }
}

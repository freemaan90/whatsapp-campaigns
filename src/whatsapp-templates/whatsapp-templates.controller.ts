import { Body, Controller, Get, Post } from '@nestjs/common';
import { WhatsappTemplatesService } from './whatsapp-templates.service';
import { CreateNewTemplateDto } from './dto/create-new-template.dto';

@Controller('whatsapp-templates')
export class WhatsappTemplatesController {
  constructor(private readonly whatsappTemplatesService: WhatsappTemplatesService) {}

  @Get(`all`)
  async getAllTemplates(){
    return await this.whatsappTemplatesService.getAllTemplates()
  }
  @Post(`new-template`)
  async createNewTemplate(@Body() createNewTemplate: CreateNewTemplateDto){
    return await this.whatsappTemplatesService.createNewTemplate(createNewTemplate)
  }
}

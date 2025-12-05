import { Body, Controller, Post } from '@nestjs/common';
import { WhatsappSenderService } from './whatsapp-sender.service';
import { WhatsAppTemplateDto } from './dto/whatsapp-template.dto';

@Controller('whatsapp-sender')
export class WhatsappSenderController {
  constructor(private readonly whatsappSenderService: WhatsappSenderService) {}
  @Post('/template')
  sendWhatsAppTemplate(@Body() data:WhatsAppTemplateDto) {
    this.whatsappSenderService.sendTemplateToWhatsApp(data)
  }
}

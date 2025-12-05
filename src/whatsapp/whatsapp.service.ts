import { Injectable } from '@nestjs/common';
import { WhatsAppTemplateDto } from 'src/whatsapp-sender/dto/whatsapp-template.dto';
import { WhatsappSenderService } from 'src/whatsapp-sender/whatsapp-sender.service';
import { MarkAsReadDto } from './dto/mark-as-read.dto';

@Injectable()
export class WhatsappService {
  constructor(private whatsappSenderService: WhatsappSenderService) {}

  async sendTemplateMessage(data: WhatsAppTemplateDto) {
    await this.whatsappSenderService.sendTemplateToWhatsApp(data);
  }

  async markAsRead(data: MarkAsReadDto) {
    await this.whatsappSenderService.sendMarkAsReadToWhatsApp(data);
  }
}

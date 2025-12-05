import { Injectable } from '@nestjs/common';
import { WhatsappSenderService } from 'src/whatsapp-sender/whatsapp-sender.service';

@Injectable()
export class WhatsappService {
  constructor(private whatsappSenderService: WhatsappSenderService) {}

  async sendMessage(to:number, body:any) {
    const data = {
      messaging_product: 'whatsapp',
      to,
      text: { body },
    };

    await this.whatsappSenderService.sendToWhatsApp(data);
  }

  async markAsRead(messageId:string) {
    const data = {
      messaging_product: 'whatsapp',
      status: 'read',
      message_id: messageId,
    };
    await this.whatsappSenderService.sendToWhatsApp(data);
  }
}

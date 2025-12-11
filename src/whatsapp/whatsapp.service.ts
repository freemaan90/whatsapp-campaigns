import { Injectable, Logger } from '@nestjs/common';
import { WhatsAppTemplateDto } from 'src/whatsapp-sender/dto/whatsapp-template.dto';
import { WhatsappSenderService } from 'src/whatsapp-sender/whatsapp-sender.service';
import { MarkAsReadDto } from './dto/mark-as-read.dto';
import { buildMediaObject } from 'src/common/utils/helpers';

@Injectable()
export class WhatsappService {
  private readonly logger = new Logger(WhatsappService.name);

  constructor(private whatsappSenderService: WhatsappSenderService) {}

  async sendTemplateMessage(data: WhatsAppTemplateDto) {
    await this.whatsappSenderService.sendTemplateToWhatsApp(data);
  }

  async sendInteractiveButtons(to, BodyText, buttons) {
    const data = {
      messaging_product: 'whatsapp',
      to,
      type: 'interactive',
      interactive: {
        type: 'button',
        body: {
          text: BodyText,
        },
        action: {
          buttons: buttons,
        },
      },
    };
    await this.whatsappSenderService.sendToWhatsApp(data);
  }

  async markAsRead(messageId: string) {
    const data = {
      messaging_product: 'whatsapp',
      status: 'read',
      message_id: messageId,
    };
    await this.whatsappSenderService.sendMarkAsReadToWhatsApp(data);
  }

  async sendMediaMessage(
    to: string,
    type: MediaType,
    mediaUrl: string,
    caption: string,
  ): Promise<void> {
    const mediaObject = buildMediaObject(type, mediaUrl, caption);
    const data = {
      messaging_product: 'whatsapp',
      to,
      type,
      ...mediaObject,
    };
    await this.whatsappSenderService.sendToWhatsApp(data);
  }

  async sendContactMessage(to, contact) {
    const data = {
      messaging_product: 'whatsapp',
      to,
      type: 'contacts',
      contacts: [contact],
    };
    await this.whatsappSenderService.sendToWhatsApp(data);
  }
  async sendLocationMessage(to, latitude, longitud, name, address) {
    const data = {
      messaging_product: 'whatsapp',
      to,
      type: 'location',
      location: {
        latitude: latitude,
        longitude: longitud,
        name: name,
        address: address,
      },
    };

    await this.whatsappSenderService.sendToWhatsApp(data);
  }
  async sendMessage(to: string, body: string, messageId?: string) {
    
    const data = {
      messaging_product: 'whatsapp',
      to,
      text: { body },
    };

    await this.whatsappSenderService.sendToWhatsApp(data);
  }
}

import { Injectable } from '@nestjs/common';
import { SendTextMessageDto } from './dto/send-text-message.dto';
import { ConfigService } from '@nestjs/config';
import { HttpRequestService } from 'src/http-request/http-request.service';
import { isGreeting, normalizePhoneNumber } from 'src/common/utils/helpers';
import { WhatsappService } from 'src/whatsapp/whatsapp.service';
import {
  Contact,
  Message,
} from 'src/interfaces/WhatsappStatusWebhook.interfaces';
import { ConversationStateService } from 'src/conversation-state/conversation-state.service';
import { WhatsappMenuService } from 'src/whatsapp-menu/whatsapp-menu.service';

@Injectable()
export class WhatsappMessagesService {
  constructor(
    private configService: ConfigService,
    private readonly httpRequest: HttpRequestService,
    private whatsAppService: WhatsappService,
    private readonly stateService: ConversationStateService,
    private menuService: WhatsappMenuService
  ) {}

  async sendTextMessage({ to, text }: SendTextMessageDto) {
    const data = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to,
      type: 'text',
      text: {
        preview_url: false,
        body: text,
      },
    };
    const baseURL = `${this.configService.get('BASE_URL')}/v24.0/${this.configService.get('BUSINESS_PHONE')}/messages`;
    const headers = {
      Authorization: `Bearer ${this.configService.get('API_TOKEN')}`,
    };
    return this.httpRequest.post(baseURL, data, headers);
  }

  async handleIncomingMessage(message: Message, senderInfo: Contact) {
    const phoneNumber = normalizePhoneNumber(message.from);

    if (!message) return;

    if (message.type === 'text' && message.text?.body) {
      await this.handleTextMessage(message, phoneNumber, senderInfo);
      await this.whatsAppService.markAsRead(message.id);
      return;
    }

    if (message.type === 'interactive' && message.interactive?.button_reply) {
      const option = message.interactive.button_reply.id.toLowerCase().trim();
      await this.menuService.handleMenuOption(phoneNumber, option);
      await this.whatsAppService.markAsRead(message.id);
      return;
    }
  }

  async sendMedia(to: string, option: any) {
    let mediaUrl;
    let caption;
    let type;
    switch (option) {
      case 'video':
        mediaUrl = 'https://s3.amazonaws.com/gndx.dev/medpet-video.mp4';
        caption = '¡Esto es una video!';
        type = 'video';
        break;
      case 'document':
        mediaUrl = 'https://s3.amazonaws.com/gndx.dev/medpet-file.pdf';
        caption = '¡Esto es un PDF!';
        type = 'document';
        break;

      case 'audio':
        mediaUrl = 'https://s3.amazonaws.com/gndx.dev/medpet-audio.aac';
        caption = 'Bienvenido';
        type = 'audio';
        break;

      case 'image':
        mediaUrl = 'https://s3.amazonaws.com/gndx.dev/medpet-imagen.png';
        caption = '¡Esto es una Imagen!';
        type = 'image';
        break;

      default:
        break;
    }

    await this.whatsAppService.sendMediaMessage(to, type, mediaUrl, caption);
  }

  private async handleTextMessage(
    message: Message,
    phoneNumber: string,
    senderInfo: Contact,
  ) {
    const incomingMessage =
      message.text && message.text.body.toLowerCase().trim();

    if (incomingMessage && isGreeting(incomingMessage)) {
      await this.menuService.sendWelcomeMessage(phoneNumber, message.id, senderInfo);
      await this.menuService.sendWelcomeMenu(phoneNumber);
      return;
    }

    if (
      incomingMessage &&
      ['document', 'image', 'audio', 'video'].includes(incomingMessage)
    ) {
      await this.sendMedia(phoneNumber, incomingMessage);
      return;
    }

    if (await this.stateService.getAppointmentState(phoneNumber)) {
      this.menuService.handleAppointmentFlow(phoneNumber, incomingMessage);
      return;
    }

    if (await this.stateService.getAssistantState(phoneNumber)) {
      await this.menuService.hadleAssistandFlow(phoneNumber, incomingMessage);
      return;
    }

    if (message.interactive?.button_reply) {
      const option = message.interactive.button_reply.id;
      await this.menuService.handleMenuOption(phoneNumber, option);
    }
  }
}

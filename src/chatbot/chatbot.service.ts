import { Injectable } from '@nestjs/common';
import { isGreeting, normalizePhoneNumber } from 'src/common/utils/helpers';
import { ConversationStateService } from 'src/conversation-state/conversation-state.service';
import {
  Contact,
  Message,
} from 'src/interfaces/WhatsappStatusWebhook.interfaces';
import { WhatsappMenuService } from 'src/whatsapp-menu/whatsapp-menu.service';
import { WhatsappService } from 'src/whatsapp/whatsapp.service';

@Injectable()
export class ChatbotService {
  constructor(
    private readonly whatsappService: WhatsappService,
    private readonly menuService: WhatsappMenuService,
    private readonly stateService: ConversationStateService
  ) {}

  async processMessage(message: Message, senderInfo: Contact) {
    const phoneNumber = normalizePhoneNumber(message.from);

    if (message.type === 'text') {
      return this.handleTextMessage(phoneNumber, message, senderInfo);
    }

    if (message.type === 'interactive') {
      const option = message.interactive.button_reply.id.toLowerCase().trim();
      return this.menuService.handleMenuOption(phoneNumber, option);
    }
  }

  private async handleTextMessage(
    phoneNumber: string,
    message: Message,
    senderInfo: Contact,
  ) {
    const incomingMessage = message.text.body.toLowerCase().trim();

    if (isGreeting(incomingMessage)) {
      await this.menuService.sendWelcomeMessage(
        phoneNumber,
        message.id,
        senderInfo,
      );
      await this.menuService.sendWelcomeMenu(phoneNumber);
      return;
    }

    const mediaConfig: Record<
      string,
      { type: MediaType; url: string; caption: string }
    > = {
      video: {
        type: 'video',
        url: 'https://s3.amazonaws.com/gndx.dev/medpet-video.mp4',
        caption: '¡Esto es un video!',
      },
      document: {
        type: 'document',
        url: 'https://s3.amazonaws.com/gndx.dev/medpet-file.pdf',
        caption: '¡Esto es un PDF!',
      },
      audio: {
        type: 'audio',
        url: 'https://s3.amazonaws.com/gndx.dev/medpet-audio.aac',
        caption: 'Bienvenido',
      },
      image: {
        type: 'image',
        url: 'https://s3.amazonaws.com/gndx.dev/medpet-imagen.png',
        caption: '¡Esto es una Imagen!',
      },
    };

    if (['document', 'image', 'audio', 'video'].includes(incomingMessage)) {
      const { type, url, caption } = mediaConfig[incomingMessage];
      await this.whatsappService.sendMediaMessage(
        phoneNumber,
        type,
        url,
        caption,
      );
      return;
    }

    if (this.stateService.getAppointmentState(phoneNumber)) {
      await this.menuService.handleAppointmentFlow(
        phoneNumber,
        incomingMessage,
      );
      return;
    }

    if (this.stateService.getAssistandState(phoneNumber)) {
      await this.menuService.hadleAssistandFlow(phoneNumber, incomingMessage);
      return;
    }
  }
}

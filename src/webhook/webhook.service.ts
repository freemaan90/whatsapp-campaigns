// webhook.service.ts
import { Injectable, ForbiddenException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WhatsappStatusWebhook } from 'src/interfaces/WhatsappStatusWebhook.interfaces';
import { WhatsappMessagesService } from 'src/whatsapp-messages/whatsapp-messages.service';

@Injectable()
export class WebhookService {
  private readonly logger = new Logger(WebhookService.name);

  constructor(
    private readonly configService: ConfigService,
    private whatsAppMessagesService:WhatsappMessagesService
  ) {}

  verifyWebhook(
    mode?: string,
    token?: string,
    challenge?: string,
  ): string | undefined {
    const expectedToken = this.configService.get<string>(
      'WEBHOOK_VERIFY_TOKEN',
    );

    if (mode === 'subscribe' && token === expectedToken) {
      this.logger.log('Webhook verified successfully!');
      return challenge; // Nest se encarga de enviar esto como respuesta
    }

    throw new ForbiddenException('Invalid verification token');
  }

  async handleIncoming(body: WhatsappStatusWebhook): Promise<void> {  
    this.logger.log(JSON.stringify(body))  
    const message = body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
    const senderInfo = body?.entry?.[0]?.changes?.[0]?.value?.contacts?.[0]
    if (message && senderInfo) {
      this.whatsAppMessagesService.handleIncomingMessage(message,senderInfo)
    }
  }
}

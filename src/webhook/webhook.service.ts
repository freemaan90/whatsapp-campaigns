// webhook.service.ts
import { Injectable, ForbiddenException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class WebhookService {
  private readonly logger = new Logger(WebhookService.name);

  constructor(private readonly configService: ConfigService) {}

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

  async handleIncoming(body: any): Promise<void> {
    const message = body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
    const senderInfo = body?.entry?.[0]?.changes?.[0]?.value?.contacts?.[0];

    if (message) {
      // Aquí inyectás tu messageHandler como dependencia
      // o lo importás desde otro servicio
      await this.processMessage(message, senderInfo);
    }

    this.logger.log('Webhook processed successfully');
  }

  private async processMessage(message: any, senderInfo: any) {
    // Lógica de negocio: delegar a otro servicio, guardar en DB, etc.
    // Ejemplo:
    // await this.messageHandler.handleIncomingMessage(message, senderInfo);
    this.logger.debug(`Message: ${JSON.stringify(message)}, Sender: ${JSON.stringify(senderInfo)}`);
  }
}

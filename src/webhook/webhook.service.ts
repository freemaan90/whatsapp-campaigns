// webhook.service.ts
import { Injectable, ForbiddenException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class WebhookService {
  private readonly logger = new Logger(WebhookService.name);

  constructor(private readonly configService: ConfigService) {}

  verifyWebhook(mode?: string, token?: string, challenge?: string): string | undefined {
    const expectedToken = this.configService.get<string>('WEBHOOK_VERIFY_TOKEN');

    if (mode === 'subscribe' && token === expectedToken) {
      this.logger.log('Webhook verified successfully!');
      return challenge; // Nest se encarga de enviar esto como respuesta
    }

    throw new ForbiddenException('Invalid verification token');
  }
}
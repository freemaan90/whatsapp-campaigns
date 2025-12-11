// webhook.controller.ts
import { Body, Controller, Get, HttpCode, Post, Query, Req, Res } from '@nestjs/common';
import { WebhookService } from './webhook.service';
import type { WhatsappStatusWebhook } from 'src/interfaces/WhatsappStatusWebhook.interfaces';

@Controller('webhook')
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  @Post()
  @HttpCode(200) // evita tener que usar res.sendStatus(200)
  async handleIncoming(@Body() body: WhatsappStatusWebhook): Promise<void> {
    await this.webhookService.handleIncoming(body);
  }

  @Get()
  verifyWebhook(
    @Query('hub.mode') mode: string,
    @Query('hub.verify_token') token: string,
    @Query('hub.challenge') challenge: string,
  ) {
    return this.webhookService.verifyWebhook(mode, token, challenge);
  }
}

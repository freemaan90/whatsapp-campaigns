import { Module } from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { WebhookController } from './webhook.controller';
import { WhatsappMessagesService } from 'src/whatsapp-messages/whatsapp-messages.service';
import { HttpRequestModule } from 'src/http-request/http-request.module';
import { WhatsappService } from 'src/whatsapp/whatsapp.service';
import { GoogleSheetsService } from 'src/google-sheets/google-sheets.service';
import { WhatsappSenderService } from 'src/whatsapp-sender/whatsapp-sender.service';

@Module({
  imports: [HttpRequestModule], // <-- solo este, ya trae HttpModule
  controllers: [WebhookController],
  providers: [WebhookService, WhatsappMessagesService,WhatsappService,GoogleSheetsService,WhatsappSenderService],
  exports: [WhatsappMessagesService,WhatsappService,GoogleSheetsService,WhatsappSenderService],
})
export class WebhookModule {}

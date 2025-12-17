import { Module } from '@nestjs/common';
import { WhatsappMessagesService } from './whatsapp-messages.service';
import { WhatsappMessagesController } from './whatsapp-messages.controller';
import { HttpRequestModule } from 'src/http-request/http-request.module';
import { WhatsappService } from 'src/whatsapp/whatsapp.service';
import { WhatsappSenderService } from 'src/whatsapp-sender/whatsapp-sender.service';
import { GoogleSheetsService } from 'src/google-sheets/google-sheets.service';
import { ConversationStateService } from 'src/conversation-state/conversation-state.service';
import { WhatsappMenuService } from 'src/whatsapp-menu/whatsapp-menu.service';
import { RedisService } from 'src/redis/redis.service';

@Module({
  imports: [HttpRequestModule], // <-- solo este, ya trae HttpModule
  controllers: [WhatsappMessagesController],
  providers: [
    WhatsappMessagesService,
    WhatsappService,
    WhatsappSenderService,
    GoogleSheetsService,
    ConversationStateService,
    WhatsappMenuService,
    RedisService
  ],
  exports: [
    WhatsappService,
    WhatsappSenderService,
    GoogleSheetsService,
    ConversationStateService,
    WhatsappMenuService
  ],
})
export class WhatsappMessagesModule {}

import { Module } from '@nestjs/common';
import { ChatbotService } from './chatbot.service';
import { ChatbotController } from './chatbot.controller';
import { WhatsappService } from 'src/whatsapp/whatsapp.service';
import { WhatsappMenuService } from 'src/whatsapp-menu/whatsapp-menu.service';
import { ConversationStateService } from 'src/conversation-state/conversation-state.service';
import { WhatsappSenderService } from 'src/whatsapp-sender/whatsapp-sender.service';
import { GoogleSheetsService } from 'src/google-sheets/google-sheets.service';
import { HttpRequestModule } from 'src/http-request/http-request.module';
import { RedisService } from 'src/redis/redis.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConversationState } from 'src/conversation-state/conversation-state.entity';

@Module({
  imports: [HttpRequestModule, TypeOrmModule.forFeature([ConversationState])],
  controllers: [ChatbotController],
  providers: [
    ChatbotService,
    WhatsappService,
    WhatsappMenuService,
    ConversationStateService,
    WhatsappSenderService,
    GoogleSheetsService,
    RedisService,
  ],
  exports: [
    WhatsappService,
    WhatsappMenuService,
    ConversationStateService,
    WhatsappSenderService,
  ],
})
export class ChatbotModule {}

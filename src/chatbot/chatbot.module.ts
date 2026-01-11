import { Module } from '@nestjs/common';
import { ChatbotService } from './chatbot.service';
import { ChatbotController } from './chatbot.controller';
import { HttpRequestModule } from 'src/http-request/http-request.module';
import { AppointmentModule } from 'src/appointment/appointment.module';
import { ConversationStateModule } from 'src/conversation-state/conversation-state.module';
import { WhatsappMenuModule } from 'src/whatsapp-menu/whatsapp-menu.module';
import { WhatsappModule } from 'src/whatsapp/whatsapp.module';
import { WhatsappSenderModule } from 'src/whatsapp-sender/whatsapp-sender.module';
import { RedisModule } from 'src/redis/redis.module';

@Module({
  imports: [
    HttpRequestModule,
    AppointmentModule,
    ConversationStateModule,
    WhatsappMenuModule,
    WhatsappModule,
    WhatsappSenderModule,
    RedisModule,
  ],
  controllers: [ChatbotController],
  providers: [ChatbotService],
  exports: [],
})
export class ChatbotModule {}
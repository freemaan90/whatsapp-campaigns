import { Module } from '@nestjs/common';
import { WhatsappMenuService } from './whatsapp-menu.service';
import { WhatsappMenuController } from './whatsapp-menu.controller';
import { WhatsappService } from 'src/whatsapp/whatsapp.service';
import { GoogleSheetsService } from 'src/google-sheets/google-sheets.service';
import { ConversationStateService } from 'src/conversation-state/conversation-state.service';
import { WhatsappSenderService } from 'src/whatsapp-sender/whatsapp-sender.service';
import { HttpRequestModule } from 'src/http-request/http-request.module';
import { RedisService } from 'src/redis/redis.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConversationState } from 'src/conversation-state/conversation-state.entity';
import { AppointmentService } from 'src/appointment/appointment.service';
import { AppointmentModule } from 'src/appointment/appointment.module';

@Module({
  imports: [
    AppointmentModule,
    HttpRequestModule, 
    TypeOrmModule.forFeature([ConversationState]),
    TypeOrmModule.forFeature([AppointmentService]),
  ],
  controllers: [WhatsappMenuController],
  providers: [
    WhatsappMenuService,
    WhatsappService,
    GoogleSheetsService,
    ConversationStateService,
    WhatsappSenderService,
    RedisService,
  ],
})
export class WhatsappMenuModule {}

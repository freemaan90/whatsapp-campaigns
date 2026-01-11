import { Module } from '@nestjs/common';
import { WebhookService } from 'src/webhook/webhook.service';
import { UserResolverService } from './userResolver.service';
import { UserService } from '../user.service';
import { RedisService } from 'src/redis/redis.service';
import { WhatsappMessagesService } from 'src/whatsapp-messages/whatsapp-messages.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entitys/user.entity';
import { WhatsApp } from '../entitys/whatsapp.entity';
import { HttpRequestModule } from 'src/http-request/http-request.module';
import { WhatsappService } from 'src/whatsapp/whatsapp.service';
import { ConversationStateService } from 'src/conversation-state/conversation-state.service';
import { AppointmentService } from 'src/appointment/appointment.service';
import { ConversationState } from 'src/conversation-state/conversation-state.entity';
import { WhatsappMenuService } from 'src/whatsapp-menu/whatsapp-menu.service';
import { WhatsappSenderService } from 'src/whatsapp-sender/whatsapp-sender.service';
import { GoogleSheetsService } from 'src/google-sheets/google-sheets.service';
import { Appointment } from 'src/appointment/appointment.entity';

@Module({
  imports: [
    HttpRequestModule,
    TypeOrmModule.forFeature([User, WhatsApp]),
    TypeOrmModule.forFeature([ConversationState]),
    TypeOrmModule.forFeature([AppointmentService]),
    TypeOrmModule.forFeature([Appointment])
  ],
  providers: [
    WebhookService,
    UserResolverService,
    UserService,
    RedisService,
    WhatsappMessagesService,
    WhatsappService,
    ConversationStateService,
    WhatsappMenuService,
    WhatsappSenderService,
    GoogleSheetsService,
    AppointmentService
  ],
  exports: [UserResolverService],
})
export class UserResolverModule {}

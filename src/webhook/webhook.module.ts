import { Module } from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { WebhookController } from './webhook.controller';
import { WhatsappMessagesService } from 'src/whatsapp-messages/whatsapp-messages.service';
import { HttpRequestModule } from 'src/http-request/http-request.module';
import { WhatsappService } from 'src/whatsapp/whatsapp.service';
import { GoogleSheetsService } from 'src/google-sheets/google-sheets.service';
import { WhatsappSenderService } from 'src/whatsapp-sender/whatsapp-sender.service';
import { ConversationStateService } from 'src/conversation-state/conversation-state.service';
import { WhatsappMenuService } from 'src/whatsapp-menu/whatsapp-menu.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConversationState } from 'src/conversation-state/conversation-state.entity';
import { AppointmentService } from 'src/appointment/appointment.service';
import { AppointmentModule } from 'src/appointment/appointment.module';
import { User } from 'src/user/entitys/user.entity';
import { WhatsApp } from 'src/user/entitys/whatsapp.entity';
import { UserResolverService } from 'src/user/services/userResolver.service';
import { UserResolverModule } from 'src/user/services/userResolver.module';
import { UserService } from 'src/user/user.service';
import { RedisService } from 'src/redis/redis.service';

@Module({
  imports: [
    AppointmentModule,
    HttpRequestModule,
    UserResolverModule,
    TypeOrmModule.forFeature([ConversationState]),
    TypeOrmModule.forFeature([AppointmentService]),
    TypeOrmModule.forFeature([User, WhatsApp]),
  ], // <-- solo este, ya trae HttpModule
  controllers: [WebhookController],
  providers: [
    WebhookService,
    WhatsappMessagesService,
    WhatsappService,
    GoogleSheetsService,
    WhatsappSenderService,
    ConversationStateService,
    WhatsappMenuService,
    UserResolverService,
    UserService,
    RedisService
  ],
  exports: [
    WhatsappMessagesService,
    WhatsappService,
    GoogleSheetsService,
    WhatsappSenderService,
    ConversationStateService,
    WhatsappMenuService,
  ],
})
export class WebhookModule {}

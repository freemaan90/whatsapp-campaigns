import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { HttpRequestModule } from "src/http-request/http-request.module";
import { User } from "../entitys/user.entity";
import { WhatsApp } from "../entitys/whatsapp.entity";
import { ConversationState } from "src/conversation-state/conversation-state.entity";
import { Appointment } from "src/appointment/appointment.entity";
import { UserModule } from "../user.module";
import { RedisModule } from "src/redis/redis.module";
import { WhatsappModule } from "src/whatsapp/whatsapp.module";
import { WhatsappSenderModule } from "src/whatsapp-sender/whatsapp-sender.module";
import { AppointmentModule } from "src/appointment/appointment.module";
import { ConversationStateModule } from "src/conversation-state/conversation-state.module";
import { UserResolverService } from "./userResolver.service";
import { WebhookService } from "src/webhook/webhook.service";

@Module({
  imports: [
    HttpRequestModule,
    TypeOrmModule.forFeature([User, WhatsApp, ConversationState, Appointment]),
    UserModule,
    RedisModule,
    WhatsappModule,
    WhatsappSenderModule,
    AppointmentModule,
    ConversationStateModule,
  ],
  providers: [
    UserResolverService
  ],
  exports: [UserResolverService],
})
export class UserResolverModule {}
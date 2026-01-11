import { Module } from "@nestjs/common";
import { AppointmentModule } from "src/appointment/appointment.module";
import { ConversationStateModule } from "src/conversation-state/conversation-state.module";
import { HttpRequestModule } from "src/http-request/http-request.module";
import { RedisModule } from "src/redis/redis.module";
import { WhatsappMenuModule } from "src/whatsapp-menu/whatsapp-menu.module";
import { WhatsappSenderModule } from "src/whatsapp-sender/whatsapp-sender.module";
import { WhatsappModule } from "src/whatsapp/whatsapp.module";
import { WhatsappMessagesService } from "./whatsapp-messages.service";

@Module({
  imports: [
    HttpRequestModule,
    AppointmentModule,
    ConversationStateModule,
    WhatsappSenderModule,
    WhatsappModule,
    WhatsappMenuModule,
    RedisModule,
  ],
  providers: [WhatsappMessagesService],
  exports: [WhatsappMessagesService],
})
export class WhatsappMessagesModule {}
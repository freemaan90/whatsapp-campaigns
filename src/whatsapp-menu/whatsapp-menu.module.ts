import { Module } from "@nestjs/common";
import { AppointmentModule } from "src/appointment/appointment.module";
import { ConversationStateModule } from "src/conversation-state/conversation-state.module";
import { HttpRequestModule } from "src/http-request/http-request.module";
import { RedisModule } from "src/redis/redis.module";
import { WhatsappSenderModule } from "src/whatsapp-sender/whatsapp-sender.module";
import { WhatsappMenuService } from "./whatsapp-menu.service";
import { WhatsappModule } from "src/whatsapp/whatsapp.module";

@Module({
  imports: [
    HttpRequestModule,
    AppointmentModule,
    ConversationStateModule,
    WhatsappSenderModule,
    WhatsappModule,
    RedisModule,
  ],
  providers: [WhatsappMenuService],
  exports: [WhatsappMenuService],
})
export class WhatsappMenuModule {}
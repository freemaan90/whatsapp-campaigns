import { Module } from "@nestjs/common";
import { AppointmentModule } from "src/appointment/appointment.module";
import { ConversationStateModule } from "src/conversation-state/conversation-state.module";
import { HttpRequestModule } from "src/http-request/http-request.module";
import { UserResolverModule } from "src/user/services/userResolver.module";
import { WhatsappMenuModule } from "src/whatsapp-menu/whatsapp-menu.module";
import { WhatsappMessagesModule } from "src/whatsapp-messages/whatsapp-messages.module";
import { WhatsappSenderModule } from "src/whatsapp-sender/whatsapp-sender.module";
import { WhatsappModule } from "src/whatsapp/whatsapp.module";
import { WebhookController } from "./webhook.controller";
import { WebhookService } from "./webhook.service";

@Module({
  imports: [
    WhatsappModule,
    HttpRequestModule,
    UserResolverModule,
    WhatsappMessagesModule,
    WhatsappSenderModule,
    WhatsappMenuModule,
    ConversationStateModule,
    AppointmentModule,
  ],
  controllers: [WebhookController],
  providers: [WebhookService],
})
export class WebhookModule {}
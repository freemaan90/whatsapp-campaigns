import { Module } from "@nestjs/common";
import { HttpRequestModule } from "src/http-request/http-request.module";
import { WhatsappSenderModule } from "src/whatsapp-sender/whatsapp-sender.module";
import { WhatsappService } from "./whatsapp.service";

@Module({
  imports: [HttpRequestModule, WhatsappSenderModule], // <-- ESTO ES OBLIGATORIO
  providers: [WhatsappService],
  exports: [WhatsappService],
})
export class WhatsappModule {}
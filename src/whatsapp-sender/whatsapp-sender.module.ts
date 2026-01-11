import { Module } from "@nestjs/common";
import { HttpRequestModule } from "src/http-request/http-request.module";
import { WhatsappSenderService } from "./whatsapp-sender.service";

@Module({
  imports: [HttpRequestModule],
  providers: [WhatsappSenderService],
  exports: [WhatsappSenderService],
})
export class WhatsappSenderModule {}
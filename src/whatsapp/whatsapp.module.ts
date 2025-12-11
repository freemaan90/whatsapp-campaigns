import { Module } from '@nestjs/common';
import { WhatsappService } from './whatsapp.service';
import { WhatsappController } from './whatsapp.controller';
import { WhatsappSenderService } from 'src/whatsapp-sender/whatsapp-sender.service';
import { HttpRequestModule } from 'src/http-request/http-request.module';

@Module({
  imports: [
    HttpRequestModule
  ],
  controllers: [WhatsappController],
  providers: [WhatsappService, WhatsappSenderService,],
  exports: [WhatsappSenderService],
})
export class WhatsappModule {}
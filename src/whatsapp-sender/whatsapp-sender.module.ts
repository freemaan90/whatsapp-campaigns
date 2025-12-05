import { Module } from '@nestjs/common';
import { WhatsappSenderService } from './whatsapp-sender.service';
import { WhatsappSenderController } from './whatsapp-sender.controller';

@Module({
  controllers: [WhatsappSenderController],
  providers: [WhatsappSenderService],
})
export class WhatsappSenderModule {}

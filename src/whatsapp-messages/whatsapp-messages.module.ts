import { Module } from '@nestjs/common';
import { WhatsappMessagesService } from './whatsapp-messages.service';
import { WhatsappMessagesController } from './whatsapp-messages.controller';
import { HttpRequestModule } from 'src/http-request/http-request.module';

@Module({
  imports: [HttpRequestModule], // <-- solo este, ya trae HttpModule
  controllers: [WhatsappMessagesController],
  providers: [WhatsappMessagesService],
})
export class WhatsappMessagesModule {}

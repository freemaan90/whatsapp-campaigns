import { Module } from '@nestjs/common';
import { WhatsappSenderService } from './whatsapp-sender.service';
import { WhatsappSenderController } from './whatsapp-sender.controller';
import { HttpRequestModule } from 'src/http-request/http-request.module';

@Module({
  imports: [HttpRequestModule], // <-- solo este, ya trae HttpModule
  controllers: [WhatsappSenderController],
  providers: [WhatsappSenderService], // <-- solo tu servicio propio
  exports: [WhatsappSenderService],   // <-- exporta lo que quieras usar fuera
})
export class WhatsappSenderModule {}
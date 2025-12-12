import { Module } from '@nestjs/common';
import { WhatsappPhonesService } from './whatsapp-phones.service';
import { WhatsappPhonesController } from './whatsapp-phones.controller';
import { HttpRequestModule } from 'src/http-request/http-request.module';

@Module({
  imports: [HttpRequestModule], // <-- solo este, ya trae HttpModule
  controllers: [WhatsappPhonesController],
  providers: [WhatsappPhonesService],
})
export class WhatsappPhonesModule {}

import { Module } from '@nestjs/common';
import { WhatsappTemplatesService } from './whatsapp-templates.service';
import { WhatsappTemplatesController } from './whatsapp-templates.controller';
import { HttpRequestModule } from 'src/http-request/http-request.module';

@Module({
  imports: [HttpRequestModule], // <-- solo este, ya trae HttpModule
  controllers: [WhatsappTemplatesController],
  providers: [WhatsappTemplatesService],
})
export class WhatsappTemplatesModule {}

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WhatsappSenderModule } from './whatsapp-sender/whatsapp-sender.module';
import { ConfigModule } from '@nestjs/config';
import { HttpRequestService } from './http-request/http-request.service';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal:true,
    envFilePath:['.env']
  }),WhatsappSenderModule],
  controllers: [AppController],
  providers: [AppService, HttpRequestService],
})
export class AppModule {}

// app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WhatsappSenderModule } from './whatsapp-sender/whatsapp-sender.module';
import { WhatsappModule } from './whatsapp/whatsapp.module';
import { HttpRequestModule } from './http-request/http-request.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    HttpRequestModule,
    WhatsappSenderModule,
    WhatsappModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
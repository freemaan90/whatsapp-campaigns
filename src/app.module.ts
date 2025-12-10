// app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WhatsappSenderModule } from './whatsapp-sender/whatsapp-sender.module';
import { WhatsappModule } from './whatsapp/whatsapp.module';
import { HttpRequestModule } from './http-request/http-request.module';
import { HealthModule } from './health/health.module';
import { WhatsappTemplatesModule } from './whatsapp-templates/whatsapp-templates.module';
import { WhatsappMessagesModule } from './whatsapp-messages/whatsapp-messages.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    HttpRequestModule,
    WhatsappSenderModule,
    WhatsappModule,
    HealthModule,
    WhatsappTemplatesModule,
    WhatsappMessagesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
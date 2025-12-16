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
import { WebhookModule } from './webhook/webhook.module';
import { GoogleSheetsModule } from './google-sheets/google-sheets.module';
import { WhatsappPhonesModule } from './whatsapp-phones/whatsapp-phones.module';
import { ChatbotModule } from './chatbot/chatbot.module';
import { WhatsappMenuModule } from './whatsapp-menu/whatsapp-menu.module';
import { ConversationStateModule } from './conversation-state/conversation-state.module';
import { CacheModule } from '@nestjs/cache-manager';
import KeyvRedis from '@keyv/redis';
import { CacheableMemory, Keyv } from 'cacheable';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => ({
        stores: [
          new KeyvRedis('redis://127.0.0.1:6379'), // primero Redis
          new Keyv({
            store: new CacheableMemory({ ttl: 60000, lruSize: 5000 }),
          }),
        ],
      }),
    }),
    HttpRequestModule,
    WhatsappSenderModule,
    WhatsappModule,
    HealthModule,
    WhatsappTemplatesModule,
    WhatsappMessagesModule,
    WebhookModule,
    GoogleSheetsModule,
    WhatsappPhonesModule,
    ChatbotModule,
    WhatsappMenuModule,
    ConversationStateModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

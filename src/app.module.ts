// app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
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
import { RedisModule } from './redis/redis.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AppointmentModule } from './appointment/appointment.module';
import { ContactModule } from './contact/contact.module';
import { LocationModule } from './location/location.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get<string>('DB_USER'),
        password: config.get<string>('DB_PASS'),
        database: config.get<string>('DB_NAME'),
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      inject: [ConfigService],
      useFactory: async (config:ConfigService) => ({
        stores: [
          new KeyvRedis(`redis://${config.get('REDIS_HOST')}:${config.get('REDIS_PORT')}`), // primero Redis
          new Keyv({
            store: new CacheableMemory({ ttl: 60000, lruSize: 5000 }),
          }),
        ],
        ttl: config.get<number>('CACHE_TTL') ?? 60000,
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
    RedisModule,
    UserModule,
    AppointmentModule,
    ContactModule,
    LocationModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { ConversationStateService } from './conversation-state.service';
import { ConversationStateController } from './conversation-state.controller';
import { RedisService } from 'src/redis/redis.service';

@Module({
  controllers: [ConversationStateController],
  providers: [ConversationStateService,RedisService],
})
export class ConversationStateModule {}

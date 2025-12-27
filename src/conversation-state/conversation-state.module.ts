import { Module } from '@nestjs/common';
import { ConversationStateService } from './conversation-state.service';
import { ConversationStateController } from './conversation-state.controller';

@Module({
  controllers: [ConversationStateController],
  providers: [ConversationStateService],
})
export class ConversationStateModule {}

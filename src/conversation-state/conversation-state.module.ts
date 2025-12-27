import { Module } from '@nestjs/common';
import { ConversationStateService } from './conversation-state.service';
import { ConversationStateController } from './conversation-state.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConversationState } from './conversation-state.entity';

@Module({
    imports:[
      TypeOrmModule.forFeature([ConversationState])
    ],
  controllers: [ConversationStateController],
  providers: [ConversationStateService],
  exports: [ConversationStateService]
})
export class ConversationStateModule {}

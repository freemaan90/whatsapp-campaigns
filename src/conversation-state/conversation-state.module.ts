import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConversationState } from "./conversation-state.entity";
import { ConversationStateService } from "./conversation-state.service";

@Module({
  imports: [TypeOrmModule.forFeature([ConversationState])],
  providers: [ConversationStateService],
  exports: [ConversationStateService],
})
export class ConversationStateModule {}
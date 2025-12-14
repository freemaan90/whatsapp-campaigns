import { Controller } from '@nestjs/common';
import { ConversationStateService } from './conversation-state.service';

@Controller('conversation-state')
export class ConversationStateController {
  constructor(private readonly conversationStateService: ConversationStateService) {}
}

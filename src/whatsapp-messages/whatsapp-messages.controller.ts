import { Body, Controller, Post } from '@nestjs/common';
import { WhatsappMessagesService } from './whatsapp-messages.service';
import { SendTextMessageDto } from './dto/send-text-message.dto';

@Controller('whatsapp-messages')
export class WhatsappMessagesController {
  constructor(
    private readonly whatsappMessagesService: WhatsappMessagesService,
  ) {}
  @Post()
  async sendTextMessage(@Body() sendTextMessageDto:SendTextMessageDto) {
    return await this.whatsappMessagesService.sendTextMessage(sendTextMessageDto)
  }
}

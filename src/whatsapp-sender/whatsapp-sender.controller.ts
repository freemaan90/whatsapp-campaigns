import { Controller } from '@nestjs/common';
import { WhatsappSenderService } from './whatsapp-sender.service';

@Controller('whatsapp-sender')
export class WhatsappSenderController {
  constructor(private readonly whatsappSenderService: WhatsappSenderService) {}
}

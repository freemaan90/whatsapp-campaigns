import { Controller } from '@nestjs/common';
import { WhatsappMenuService } from './whatsapp-menu.service';

@Controller('whatsapp-menu')
export class WhatsappMenuController {
  constructor(private readonly whatsappMenuService: WhatsappMenuService) {}
}

import { IsString } from 'class-validator';

export class MarkAsReadDto {
  @IsString()
  messaging_product: string = 'whatsapp';
  @IsString()
  status: string = 'read';
  @IsString()
  message_id: string;
}

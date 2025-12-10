import { IsNotEmpty, IsString } from 'class-validator';

export class SendTextMessageDto {
  @IsString()
  @IsNotEmpty()
  to: string;
  @IsString()
  @IsNotEmpty()
  text: string;
}

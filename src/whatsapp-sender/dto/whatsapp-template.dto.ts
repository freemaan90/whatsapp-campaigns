import { Type } from 'class-transformer';
import { IsObject, IsString, ValidateNested } from 'class-validator';

class TemplateDto {
  name: string;
}

class Language {
  code: string;
}
export class WhatsAppTemplateDto {
  @IsString()
  messaging_product: string = 'whatsapp';
  @IsString()
  to: string;
  @IsString()
  type: string = 'type';
  @IsString()
  template: string = 'template';
  @IsObject()
  @ValidateNested()
  @Type(() => TemplateDto)
  templateDto: TemplateDto;
  @IsObject()
  @ValidateNested()
  @Type(() => Language)
  language: Language;
}

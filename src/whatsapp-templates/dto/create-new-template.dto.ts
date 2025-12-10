import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsIn,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';

class ExampleDto {
  @IsArray()
  @ArrayMinSize(1)
  body_text: string[]; // simplificado a array de strings
}

export class ComponentDto {
  @IsString()
  @IsNotEmpty()
  type: string; // ej: "BODY"

  @IsString()
  @IsNotEmpty()
  text: string; // el texto con placeholders {{1}}, {{2}}, {{3}}

  @ValidateNested()
  @Type(() => ExampleDto)
  example: ExampleDto;
}

export class CreateNewTemplateDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  language: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(['MARKETING', 'UTILITY'])
  category: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => ComponentDto)
  components: ComponentDto[];
}

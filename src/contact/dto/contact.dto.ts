
import { IsOptional, IsString, IsUrl, IsArray, ValidateNested, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

class AddressDto {
  @IsString() street: string;
  @IsString() city: string;
  @IsString() state: string;
  @IsString() zip: string;
  @IsString() country: string;
  @IsString() country_code: string;
  @IsString() type: string;
}

export class ContactDto {
  @IsOptional() @IsString() company?: string;
  @IsOptional() @IsUrl() website?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AddressDto)
  addresses?: AddressDto[];

  // Si querés crear el contacto ligado a un usuario existente
  @IsInt()
  userId: number;
}

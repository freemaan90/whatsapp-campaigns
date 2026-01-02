
// dto/address.dto.ts
import { IsString, IsOptional } from 'class-validator';

export class CreateAddressDto {
  @IsString() street: string;
  @IsString() city: string;
  @IsString() state: string;
  @IsString() zip: string;
  @IsString() country: string;
  @IsString() country_code: string;
  @IsString() type: string; // 'home' | 'work' | etc.
}

export class UpdateAddressDto {
  @IsOptional() @IsString() street?: string;
  @IsOptional() @IsString() city?: string;
  @IsOptional() @IsString() state?: string;
  @IsOptional() @IsString() zip?: string;
  @IsOptional() @IsString() country?: string;
  @IsOptional() @IsString() country_code?: string;
  @IsOptional() @IsString() type?: string;
}

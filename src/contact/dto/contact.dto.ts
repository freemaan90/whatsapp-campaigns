import { IsOptional, IsString, IsUrl } from 'class-validator';

export class ContactDto {
  @IsOptional()
  @IsString()
  company?: string;

  @IsOptional()
  @IsUrl()
  website?: string;
}
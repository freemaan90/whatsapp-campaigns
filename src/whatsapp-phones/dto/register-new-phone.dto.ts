import { IsNotEmpty, IsString } from "class-validator";

export class RegisterNewPhoneDto {
    @IsString()
    @IsNotEmpty()
    sixDigitPin:string
}
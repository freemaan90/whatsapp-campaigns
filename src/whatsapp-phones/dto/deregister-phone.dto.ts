import { IsNotEmpty, IsString } from "class-validator";

export class DeregisterPhoneDto {
    @IsString()
    @IsNotEmpty()
    phoneNumberId:string
}
import { IsNotEmpty, IsString } from "class-validator";

export class RequestVerificationCodeDto{
    @IsString()
    @IsNotEmpty()
    phoneNumberId:string
}
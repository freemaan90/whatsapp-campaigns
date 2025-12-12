import { IsNotEmpty, IsString } from "class-validator";
import { RequestVerificationCodeDto } from "./request-verification-code.dto";

export class VerificationCodeDto extends RequestVerificationCodeDto{
    @IsString()
    @IsNotEmpty()
    code:string
}
import { IsNotEmpty, IsString } from "class-validator";

export class BussinesPhoneDto {
    @IsString()
    @IsNotEmpty()
    bussinesPhone:string
}
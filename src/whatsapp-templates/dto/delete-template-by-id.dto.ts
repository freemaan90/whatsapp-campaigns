import { IsNotEmpty, IsString } from "class-validator";

export class DeleteTemplateByIdDto {
    @IsString()
    @IsNotEmpty()
    HSM_ID:string
    @IsString()
    @IsNotEmpty()
    NAME:string
}
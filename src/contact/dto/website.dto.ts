import { IsNotEmpty, IsString } from "class-validator";

export class UpdateWebsiteDto {
    @IsString()
    @IsNotEmpty()
    website:string
}
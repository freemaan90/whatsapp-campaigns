import { IsNotEmpty, IsString } from "class-validator";

export class WabaIdDto{
        @IsString()
        @IsNotEmpty()
        wabaId:string
}
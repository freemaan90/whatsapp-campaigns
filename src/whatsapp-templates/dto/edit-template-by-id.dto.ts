import { IsNotEmpty, IsString } from "class-validator";
import { CreateNewTemplateDto } from "./create-new-template.dto";

export class EditTemplateByIdDto extends CreateNewTemplateDto{
        @IsString()
        @IsNotEmpty()
        HSM_ID:string
}
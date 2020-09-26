import {
    IsNotEmpty,
    MinLength
} from "class-validator";


export class ContrasenaUpdateDto{

    @IsNotEmpty()
    @MinLength(8)
    actual: string

    @IsNotEmpty()
    @MinLength(8)
    nueva: string

    @IsNotEmpty()
    @MinLength(8)
    confirmacionNueva: string



}
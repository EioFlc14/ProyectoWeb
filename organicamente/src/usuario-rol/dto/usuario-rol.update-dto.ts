import {IsNotEmpty, IsNumber, IsNumberString, IsPositive} from "class-validator";


export class UsuarioRolUpdateDto{

    @IsNotEmpty()
    @IsPositive()
    @IsNumber()
    id: number

    @IsNotEmpty()
    @IsNumberString()
    usuarioId: string

    @IsNotEmpty()
    @IsPositive()
    @IsNumber()
    rolId: number

}
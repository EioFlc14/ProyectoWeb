import {IsNotEmpty, IsNumber, IsNumberString, IsPositive} from "class-validator";


export class UsuarioRolCreateDto{


    @IsNotEmpty()
    @IsNumberString()
    usuarioId: string

    @IsNotEmpty()
    @IsNumberString()
    rolId: string


}
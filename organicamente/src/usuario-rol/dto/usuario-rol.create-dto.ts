import {IsNotEmpty, IsNumber, IsPositive} from "class-validator";


export class UsuarioRolCreateDto{


    @IsNotEmpty()
    @IsPositive()
    @IsNumber()
    usuarioId: number

    @IsNotEmpty()
    @IsPositive()
    @IsNumber()
    rolId: number


}
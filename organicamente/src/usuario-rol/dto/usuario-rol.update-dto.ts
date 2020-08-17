import {IsNotEmpty, IsNumber, IsPositive} from "class-validator";


export class UsuarioRolUpdateDto{

    @IsNotEmpty()
    @IsPositive()
    @IsNumber()
    id: number

    @IsNotEmpty()
    @IsPositive()
    @IsNumber()
    usuarioId: number

    @IsNotEmpty()
    @IsPositive()
    @IsNumber()
    rolId: number

}
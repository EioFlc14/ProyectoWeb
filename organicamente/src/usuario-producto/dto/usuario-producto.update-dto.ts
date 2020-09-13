import {IsDecimal, IsNotEmpty, IsNumber, IsNumberString, IsPositive} from "class-validator";


export class UsuarioProductoUpdateDto {

    @IsNotEmpty()
    @IsPositive()
    @IsNumber()
    id: number

    @IsNotEmpty()
    @IsNumberString()
    stock:string

    @IsNotEmpty()
    @IsNumberString()
    precio:string


    /*@IsNotEmpty()
    @IsPositive()
    @IsNumber()
    productoId:number

    @IsNotEmpty()
    @IsPositive()
    @IsNumber()
    usuarioId:number

    @IsNotEmpty()
    @IsPositive()
    @IsNumber()
    unidadId:number */


}
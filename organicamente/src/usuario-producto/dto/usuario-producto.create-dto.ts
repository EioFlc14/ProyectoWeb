import {IsDecimal, IsNotEmpty, IsNumber, IsNumberString, IsPositive} from "class-validator";


export class UsuarioProductoCreateDto{


    @IsNotEmpty()
    @IsNumberString()
    stock:string

    @IsNotEmpty()
    @IsNumberString()
    @IsDecimal({'decimal_digits': '0,3'})
    precio:string


    @IsNotEmpty()
    @IsNumberString()
    productoProductoId:string

    @IsNotEmpty()
    @IsNumberString()
    usuarioUsuarioId:string

    @IsNotEmpty()
    @IsNumberString()
    unidadUnidadId:string
}
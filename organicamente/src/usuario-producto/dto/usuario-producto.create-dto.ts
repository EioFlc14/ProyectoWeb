import {IsDecimal, IsNotEmpty, IsNumber, IsNumberString, IsPositive} from "class-validator";


export class UsuarioProductoCreateDto{


    @IsNotEmpty()
    @IsNumber()
    stock:number

    @IsNotEmpty()
    @IsNumberString()
    @IsDecimal({'decimal_digits': '0,3'})
    precio:number


    @IsNotEmpty()
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
    unidadId:number

}
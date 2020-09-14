import {IsDecimal, IsNotEmpty, IsNumber, IsNumberString, IsOptional, IsPositive, MaxLength} from "class-validator";


export class UsuarioProductoCreateDto{


    @IsNotEmpty()
    @IsNumberString()
    stock:string

    @IsNotEmpty()
    @IsNumberString()
    @IsDecimal({'decimal_digits': '0,3'})
    precio:string

    @IsOptional()
    imagen?:string


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
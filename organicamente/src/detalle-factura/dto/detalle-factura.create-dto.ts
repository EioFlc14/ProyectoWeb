import {IsDecimal, IsNotEmpty, IsNumber, IsNumberString, IsOptional, IsPositive, MaxLength, Min} from "class-validator";


export class DetalleFacturaCreateDto{

    /* @IsNotEmpty()
    @IsPositive()
    @IsNumber()
    id:number */

    @IsNotEmpty()
    @IsNumberString()
    cantidad:number

    @IsNotEmpty()
    @IsNumberString()
    @IsDecimal({'decimal_digits': '0,3'})
    valor:number

    @IsNotEmpty()
    @IsNumberString()
    @IsDecimal({'decimal_digits': '0,3'})
    precio:number

    @IsNotEmpty()
    @IsNumberString()
    usuarioProductoId:string

    @IsNotEmpty()
    @IsNumberString()
    facturaId:string


}
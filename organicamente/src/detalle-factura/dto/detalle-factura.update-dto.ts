import {IsDecimal, IsNotEmpty, IsNumber, IsNumberString, IsPositive, Min} from "class-validator";


export class detalleFacturaUpdateDto{

    @IsNotEmpty()
    @IsPositive()
    @IsNumber()
    id:number

    @IsNotEmpty()
    @IsNumber()
    @Min(1)
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
    @IsPositive()
    @IsNumber()
    usuarioProductoId:number

    @IsNotEmpty()
    @IsPositive()
    @IsNumber()
    facturaId:number



}
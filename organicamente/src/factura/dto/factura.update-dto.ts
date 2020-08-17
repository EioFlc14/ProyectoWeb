import {IsDate, IsDecimal, IsNotEmpty, IsNumber, IsNumberString, IsPositive, MaxLength} from "class-validator";


export class facturaUpdateDto{

    @IsNotEmpty()
    @IsPositive()
    @IsNumber()
    id:number

    @IsNotEmpty()
    @IsNumberString()
    @IsDecimal({'decimal_digits': '0,3'})
    total:number

    @IsNotEmpty()
    @IsDate()
    fecha:string

    @IsNotEmpty()
    @IsPositive()
    @IsNumber()
    usuarioId:number

    @IsNotEmpty()
    @MaxLength(5)
    cumplido:string


}
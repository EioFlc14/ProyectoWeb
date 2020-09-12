import {IsDate, IsDecimal, IsNotEmpty, IsNumber, IsNumberString, IsPositive, MaxLength} from "class-validator";


export class FacturaUpdateDto{

    @IsNotEmpty()
    @IsPositive()
    @IsNumber()
    id:number

    @IsNotEmpty()
    @IsNumberString()
    @IsDecimal({'decimal_digits': '0,3'})
    total:string

    @IsNotEmpty()
        //@IsDateString()
    fecha:string

    @IsNotEmpty()
    @IsNumberString()
    usuarioId:string

    @IsNotEmpty()
    @MaxLength(5)
    cumplido:string

}
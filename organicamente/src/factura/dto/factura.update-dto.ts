import {IsDate, IsDecimal, IsNotEmpty, IsNumber, IsNumberString, IsPositive, MaxLength} from "class-validator";


export class FacturaUpdateDto{

    @IsNotEmpty()
    @IsPositive()
    @IsNumber()
    id:number

    @IsNotEmpty()
    @MaxLength(5)
    cumplido:string

}
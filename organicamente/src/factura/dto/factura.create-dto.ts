import {
    IsDate,
    IsDateString,
    IsDecimal,
    IsNotEmpty,
    IsNumber,
    IsNumberString,
    IsPositive,
    MaxLength,
    Min
} from "class-validator";


export class FacturaCreateDto{

    /* @IsNotEmpty()
    @IsPositive()
    @IsNumber()
    id:number */

/*    @IsNotEmpty()
    @IsNumberString()
    @IsDecimal({'decimal_digits': '0,3'})
    total:string */

  /*  @IsNotEmpty()
    //@IsDateString()
    fecha:string */

    @IsNotEmpty()
    @IsNumberString()
    usuarioId:number

    @IsNotEmpty()
    @MaxLength(5)
    cumplido:string

}
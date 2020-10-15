import {IsNotEmpty, IsNumber, IsPositive, Max, MaxLength} from "class-validator";


export class UnidadUpdateDto{

    @IsNotEmpty()
    @IsPositive()
    @IsNumber()
    id:number

    @IsNotEmpty()
    @MaxLength(30)
    nombre:string

}
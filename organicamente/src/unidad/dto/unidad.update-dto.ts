import {IsNotEmpty, IsNumber, IsPositive, Max} from "class-validator";


export class UnidadUpdateDto{

    @IsNotEmpty()
    @IsPositive()
    @IsNumber()
    id:number

    @IsNotEmpty()
    @Max(30)
    nombre:string

}
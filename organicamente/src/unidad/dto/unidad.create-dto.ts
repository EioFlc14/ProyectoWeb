import {IsNotEmpty, IsNumber, IsPositive, Max, MaxLength} from "class-validator";


export class UnidadCreateDto{

    @IsNotEmpty()
    @MaxLength(30)
    nombre:string




}
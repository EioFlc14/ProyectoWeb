import {IsNotEmpty, IsNumber, IsPositive, Max} from "class-validator";


export class UnidadCreateDto{

    @IsNotEmpty()
    @Max(30)
    nombre:string


}
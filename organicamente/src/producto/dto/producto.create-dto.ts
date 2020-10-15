import {IsAlpha, IsNotEmpty, IsNumber, IsPositive, Max, MaxLength} from "class-validator";


export class ProductoCreateDto{

    @IsNotEmpty()
    @MaxLength(100)
    nombre:string



}
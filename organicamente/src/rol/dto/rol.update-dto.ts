import {IsNotEmpty, IsNumber, IsPositive, Max, MaxLength} from "class-validator";


export class RolUpdateDto{

    @IsNotEmpty()
    @IsPositive()
    @IsNumber()
    id:number

    @IsNotEmpty()
    @MaxLength(100)
    nombre:string



}
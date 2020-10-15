import {IsNotEmpty, Max, MaxLength} from "class-validator";


export class RolCreateDto{

    @IsNotEmpty()
    @MaxLength(100)
    nombre:string



}
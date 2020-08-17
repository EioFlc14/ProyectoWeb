import {IsNotEmpty, IsNumber, IsPositive} from "class-validator";


export class  ImagenUpdateDto{

    @IsNotEmpty()
    @IsPositive()
    @IsNumber()
    id:number

    @IsNotEmpty()
    imagen:string

    @IsNotEmpty()
    @IsPositive()
    @IsNumber()
    usuarioProductoId:number

}
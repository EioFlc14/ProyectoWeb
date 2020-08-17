import {IsNotEmpty, IsNumber, IsPositive} from "class-validator";


export class ImagenCreateDto{

    @IsNotEmpty()
    imagen:string

    @IsNotEmpty()
    @IsPositive()
    @IsNumber()
    usuarioProductoId:number


}
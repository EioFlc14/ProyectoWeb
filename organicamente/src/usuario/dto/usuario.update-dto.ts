import {
    IsAlphanumeric,
    IsEmail,
    IsNotEmpty, IsNumber,
    IsNumberString,
    IsOptional, IsPositive,
    Max,
    MaxLength,
    MinLength
} from "class-validator";


export class UsuarioUpdateDto{

    @IsNotEmpty()
    @IsPositive()
    @IsNumber()
    id:number

    @IsNotEmpty()
    @MaxLength(50)
    nombre: string

    @IsOptional()
    @MaxLength(50) // POSIBLE validar ingreso de caracteres especiales
    apellido?:string

    @IsNotEmpty()
    @MaxLength(50)
    @MinLength(8)
    @IsAlphanumeric()
    username: string

    @IsNotEmpty()
    @MaxLength(50)
    @MinLength(8)
    password: string

    @IsEmail()
    @MaxLength(50)
    email: string

    @IsNotEmpty()
    @IsNumberString()
    @MaxLength(20)
    telefono: string

    @IsNotEmpty()
    @MaxLength(200)
    direccion: string

    @IsNotEmpty()
    @MaxLength(50)
    @IsNumberString()
    identificacion: string



}
import {
    IsAlpha,
    IsAlphanumeric,
    IsEmail,
    IsNotEmpty,
    IsNumberString,
    IsOptional,
    Max,
    MaxLength,
    Min, MinLength
} from "class-validator";


export class UsuarioCreateDto {


    @IsNotEmpty()
    @MaxLength(50)
    nombre: string

    @IsOptional()
    @MaxLength(50) // POSIBLE validar ingreso de caracteres especiales
    apellido?:string

    @IsNotEmpty()
    @MaxLength(50)
    @MinLength(8)
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
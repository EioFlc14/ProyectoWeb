import {
    BadRequestException, Body,
    Controller,
    Delete,
    Get,
    InternalServerErrorException, NotFoundException,
    Param,
    Post,
    Put, Query, Res
} from "@nestjs/common";
import {UsuarioService} from "./usuario.service";
import {UsuarioCreateDto} from "./dto/usuario.create-dto";
import {validate, ValidationError} from "class-validator";
import {UsuarioUpdateDto} from "./dto/usuario.update-dto";
import {UsuarioEntity} from "./usuario.entity";


@Controller('usuario')
export class UsuarioController{

    constructor(
        private readonly _usuarioService: UsuarioService
    ) {
    }


    @Get('vista/inicio') // poner la direccion
    async obtenerUsuarios(
        @Res() res,
        @Query() parametrosConsulta
    ) {
        let resultadoEncontrado
        try {
            resultadoEncontrado = await this._usuarioService.buscarTodos()
        } catch(error){
            throw new InternalServerErrorException('Error encontrando usuarios')
        }

        if(resultadoEncontrado){
            console.log(resultadoEncontrado)
            return res.render('usuario/inicio', {arregloUsuarios: resultadoEncontrado, parametrosConsulta: parametrosConsulta}) // con esto mando resultadoEcontrado hasta usuario/inicio
        } else {
            throw new NotFoundException('NO se encontraron usuarios')
        }
    }

    @Get('vista/crear')
    crearUsuarioVista(
        @Query() parametrosConsulta,
        @Res() res
    ){
        return res.render('usuario/crear',
            {
                error: parametrosConsulta.error,
                nombre: parametrosConsulta.nombre,
                apellido: parametrosConsulta.apellido,
                email: parametrosConsulta.email,
                telefono: parametrosConsulta.telefono,
                direccion: parametrosConsulta.direccion,
                username: parametrosConsulta.username,
                password: parametrosConsulta.password,
                identificacion: parametrosConsulta.identificacion
            })
    }

    //@Post()
    @Post('crearDesdeVista')
    async crearDesdeVista(
        @Body() paramBody,
        @Res() res,
    ){
        let respuestaCreacionUsuario
        const usuarioValidado = new UsuarioCreateDto()
        usuarioValidado.nombre = paramBody.nombre
        usuarioValidado.apellido = paramBody.apellido
        usuarioValidado.email = paramBody.email
        usuarioValidado.telefono = paramBody.telefono
        usuarioValidado.direccion = paramBody.direccion
        usuarioValidado.username = paramBody.username
        usuarioValidado.password = paramBody.password
        usuarioValidado.identificacion = paramBody.identificacion


        const errores: ValidationError[] = await validate(usuarioValidado)
        const texto = `&nombre=${paramBody.nombre}&apellido=${paramBody.apellido}&email=${paramBody.email}&telefono=${paramBody.telefono}&direccion=${paramBody.direccion}&username=${paramBody.username}&identificacion=${paramBody.identificacion}`
        if(errores.length > 0){
            console.error('Errores:',errores);
            const error = 'Error en el formato de los datos'
            return res.redirect('/usuario/vista/crear?error='+error+texto)
        } else {
            try {
                respuestaCreacionUsuario = await this._usuarioService.crearUno(paramBody)
            } catch (e){
                console.error(e)
                const errorCreacion = 'Error al crear el Usuario'
                return res.redirect('/usuario/vista/crear?error='+errorCreacion+texto)
            }

            if(respuestaCreacionUsuario){
                return res.redirect('/usuario/vista/inicio?mensaje=Usuario creado correctamente') // en caso de que all esté OK se envía al inicio
            } else {
                const errorCreacion = 'Error al crear el Usuario'
                return res.redirect('/usuario/vista/crear?error='+errorCreacion+texto)
            }
        }

    }


    @Get('vista/editar/:id') // Controlador
    async editarUsuarioVista(
        @Query() parametrosConsulta,
        @Res() res,
        @Param() parametrosRuta
    ) {
        const id = Number(parametrosRuta.id)
        let usuarioEncontrado

        try {
            usuarioEncontrado = await this._usuarioService.buscarUno(id)
        } catch (error) {
            console.error('Error del servidor')
            return res.redirect('/usuario/vista/inicio?mensaje=Error buscando usuario')
        }

        if (usuarioEncontrado){
            return res.render(
                'usuario/crear',
                {
                    error: parametrosConsulta.error,
                    usuario: usuarioEncontrado
                }
            )
        } else {
            return res.redirect('/usuario/vista/inicio?mensaje=Usuario no encontrado')
        }

    }


    @Post('editarDesdeVista/:id')
    async editarDesdeVista(
        @Param() parametrosRuta,
        @Body() paramBody,
        @Res() res
    ){

        const usuarioValidado = new UsuarioUpdateDto()
        usuarioValidado.id = Number(parametrosRuta.id)
        usuarioValidado.nombre = paramBody.nombre
        usuarioValidado.apellido = paramBody.apellido
        usuarioValidado.email = paramBody.email
        usuarioValidado.telefono = paramBody.telefono
        usuarioValidado.direccion = paramBody.direccion
        usuarioValidado.username = paramBody.username
        usuarioValidado.password = paramBody.password
        usuarioValidado.identificacion = paramBody.identificacion

        const errores: ValidationError[] = await validate(usuarioValidado)
        if(errores.length > 0){
            console.error('Errores:',errores);
            return res.redirect('/usuario/vista/inicio?mensaje= Error en el formato de los datos')
        } else {

            const usuarioEditado = {
                usuarioId: Number(parametrosRuta.id),
                nombre: paramBody.nombre,
                apellido : paramBody.apellido,
                email : paramBody.email,
                telefono : paramBody.telefono,
                direccion : paramBody.direccion,
                username : paramBody.username,
                password : paramBody.password,
                identificacion : paramBody.identificacion
            } as UsuarioEntity

            try {
                await this._usuarioService.editarUno(usuarioEditado)
                return res.redirect('/usuario/vista/inicio?mensaje= Usuario editado correctamente') // en caso de que all esté OK se envía al inicio
            } catch (e){
                console.error(e)
                const errorCreacion = 'Error editando Usuario'
                return res.redirect('/usuario/vista/inicio?mensaje='+errorCreacion)
            }
        }

    }



    @Post('eliminarDesdeVista/:id')
    async eliminarDesdeVista(
        @Param() paramRuta,
        @Res() res,
    ){
        try{
            await this._usuarioService.eliminarUno(Number(paramRuta.id))
            return res.redirect('/usuario/vista/inicio?mensaje= Usuario Eliminado')
        } catch(error){
            console.error(error)
            return res.redirect('/usuario/vista/inicio?error=Error eliminando usuario')
        }
    }


}
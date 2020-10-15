import {
    Body,
    Controller,
    Get,
    Post,
    Query,
    Res, Session
} from "@nestjs/common";

import {validate, ValidationError} from "class-validator";
import {RolService} from "./rol.service";
import {RolCreateDto} from "./dto/rol.create-dto";

@Controller('rol')
export class RolController {

    constructor(
        private readonly _rolService: RolService
    ) {
    }

    @Get('vista/inicio')
    async obtenerUnidades(
        @Query() paramConsulta,
        @Res() res,
        @Session() session,
    ) {
        if (session.usuarioId) {
            let resultadoEncontrado
            try {
                resultadoEncontrado = await this._rolService.buscarTodos()
            } catch (e) {
                const error = 'Error al obtener roles.'
                return res.redirect('/principal?error=' + error)
            }

            const esAdministrador = session.roles.some((rol) => rol == 'administrador')
            const esProductor = session.roles.some((rol) => rol == 'productor')
            const esCliente = session.roles.some((rol) => rol == 'cliente')

            if (resultadoEncontrado) {
                return res.render('rol/inicio',
                    {
                        arregloRoles: resultadoEncontrado,
                        error: paramConsulta.error,
                        id: session.usuarioId,
                        esAdministrador:esAdministrador,
                        esProductor: esProductor,
                        esCliente: esCliente,
                    })
            } else {
                const error = 'No hay roles para mostrar.'
                return res.redirect('/principal?error=' + error)
            }
        } else {
            return res.redirect('/login')
        }

    }


    @Post('crearDesdeVista')
    async crearDesdeVista(
        @Body() paramBody,
        @Res() res,
        @Session() session,
    ) {
        if (session.usuarioId) {
            let respuestaCreacionRol
            const rolCreado = new RolCreateDto()
            rolCreado.nombre = paramBody.nombre

            const errores: ValidationError[] = await validate(rolCreado)
            const texto = `&nombre=${paramBody.nombre}`
            if (errores.length > 0) {
                const error = 'Error en el formato de los datos'
                return res.redirect('/rol/vista/inicio?error=' + error + texto)
            } else {

                let error
                const re = /^[\p{L}'][ \p{L}'-]*[\p{L}]$/u;
                if (re.test(paramBody.nombre)) {

                    try {
                        respuestaCreacionRol = await this._rolService.crearUno(paramBody)
                    } catch (e) {
                        console.error(e)
                        error = 'Error al crear el rol'
                        return res.redirect('/principal?error=' + error)
                    }

                    if (respuestaCreacionRol) {
                        const exito = 'Rol creado exitosamente.'
                        return res.redirect('/principal?exito=' + exito)
                    } else {
                        error = 'Error al crear el rol'
                        return res.redirect('/principal?error=' + error)
                    }
                } else {
                    error = 'Caracteres no permitidos en el nombre'
                    return res.redirect('/rol/vista/inicio?error=' + error + texto)
                }

            }

        } else {
            return res.redirect('/login')
        }

    }

}
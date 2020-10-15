import {
    Body,
    Controller,
    Get,
    Post,
    Query,
    Res, Session
} from "@nestjs/common";

import {validate, ValidationError} from "class-validator";
import {UnidadService} from "./unidad.service";
import {UnidadCreateDto} from "./dto/unidad.create-dto";


@Controller('unidad')
export class UnidadController {

    constructor(
        private readonly _unidadService: UnidadService
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
                resultadoEncontrado = await this._unidadService.buscarTodos()
            } catch (e) {
                const error = 'Error al obtener unidades.'
                return res.redirect('/principal?error=' + error)
            }

            const esAdministrador = session.roles.some((rol) => rol == 'administrador')
            const esProductor = session.roles.some((rol) => rol == 'productor')
            const esCliente = session.roles.some((rol) => rol == 'cliente')

            if (resultadoEncontrado) {
                console.log(resultadoEncontrado)
                return res.render('unidad/inicio',
                    {
                        arregloUnidades: resultadoEncontrado,
                        error: paramConsulta.error,
                        id: session.usuarioId,
                        esAdministrador:esAdministrador,
                        esProductor: esProductor,
                        esCliente: esCliente,
                    })
            } else {
                const error = 'No hay unidades para mostrar.'
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
            let respuestaCreacionUnidad
            const unidadCreado = new UnidadCreateDto()
            unidadCreado.nombre = paramBody.nombre

            const errores: ValidationError[] = await validate(unidadCreado)
            const texto = `&nombre=${paramBody.nombre}`
            if (errores.length > 0) {
                console.error('Errores:', errores);
                const error = 'Error en el formato de los datos.'
                return res.redirect('/unidad/vista/inicio?error=' + error + texto)
            } else {

                let error
                const re = /^[\p{L}'][ \p{L}'-]*[\p{L}]$/u;
                if (re.test(paramBody.nombre)) {
                    try {
                        respuestaCreacionUnidad = await this._unidadService.crearUno(paramBody)
                    } catch (e) {
                        console.error(e)
                        error = 'Error al crear la Unidad'
                        return res.redirect('/principal?error=' + error)
                    }

                    if (respuestaCreacionUnidad) {
                        const exito = 'Unidad creada exitosamente.'
                        return res.redirect('/principal?exito=' + exito)
                    } else {
                        error = 'Error al crear la Unidad'
                        return res.redirect('/principal?error=' + error)
                    }
                } else {
                    error = 'Caracteres no permitidos en el nombre'
                    return res.redirect('/unidad/vista/inicio?error=' + error + texto)
                }
            }
        } else {
            return res.redirect('/login')
        }

    }


}
import {
    Body,
    Controller,
    Get,
    InternalServerErrorException,
    NotFoundException,
    Param,
    Post,
    Query,
    Res
} from "@nestjs/common";

import {validate, ValidationError} from "class-validator";
import {UnidadService} from "./unidad.service";
import {UnidadCreateDto} from "./dto/unidad.create-dto";
import {UnidadUpdateDto} from "./dto/unidad.update-dto";
import {UnidadEntity} from "./unidad.entity";

@Controller('unidad')
export class UnidadController{

    constructor(
        private readonly _unidadService: UnidadService
    ) {
    }

    @Get('vista/inicio') // poner la direccion que corresponda
    async obtenerUnidades(
        @Res() res
    ) {
        let resultadoEncontrado
        try {
            resultadoEncontrado = await this._unidadService.buscarTodos()
        } catch(error){
            throw new InternalServerErrorException('Error encontrando unidades')
        }

        if(resultadoEncontrado){
            console.log(resultadoEncontrado)
            return res.render('unidad/inicio', {arregloUnidades: resultadoEncontrado}) // con esto mando resultadoEcontrado hasta usuario/inicio
        } else {
            throw new NotFoundException('NO se encontraron unidades')
        }
    }

    @Get('vista/crear')
    crearUnidadesVista(
        @Query() parametrosConsulta,
        @Res() res
    ){
        return res.render('unidad/crear',
            {
                error: parametrosConsulta.error,
                nombre: parametrosConsulta.nombre,
            })
    }

    //@Post()
    @Post('crearDesdeVista')
    async crearDesdeVista(
        @Body() paramBody,
        @Res() res,
    ){
        let respuestaCreacionUnidad
        const unidadCreado = new UnidadCreateDto()
        unidadCreado.nombre = paramBody.nombre

        const errores: ValidationError[] = await validate(unidadCreado)
        const texto = `&nombre=${paramBody.nombre}`
        if(errores.length > 0){
            console.error('Errores:',errores);
            const error = 'Error en el formato de los datos'
            return res.redirect('/unidad/vista/crear?error='+error+texto)
        } else {

            let error
            const re = /^[\p{L}'][ \p{L}'-]*[\p{L}]$/u;
            if(re.test(paramBody.nombre)) {
                try {
                    respuestaCreacionUnidad = await this._unidadService.crearUno(paramBody)
                } catch (e) {
                    console.error(e)
                    error = 'Error al crear la Unidad'
                    return res.redirect('/unidad/vista/crear?error=' + error + texto)
                }

                if (respuestaCreacionUnidad) {
                    return res.redirect('/unidad/vista/inicio') // en caso de que all esté OK se envía al inicio
                } else {
                    error = 'Error al crear la Unidad'
                    return res.redirect('/unidad/vista/crear?error=' + error + texto)
                }
            } else {
                error = 'Caracteres no permitidos en el nombre'
                return res.redirect('/unidad/vista/crear?error='+error)
            }
        }

    }


    @Get('vista/editar/:id') // Controlador
    async editarUnidadVista(
        @Query() parametrosConsulta,
        @Res() res,
        @Param() parametrosRuta
    ) {
        const id = Number(parametrosRuta.id)
        let unidadEncontrado

        try {
            unidadEncontrado = await this._unidadService.buscarUno(id)
        } catch (error) {
            console.error('Error del servidor')
            return res.redirect('/unidad/vista/inicio?mensaje=Error buscando unidad')
        }

        if (unidadEncontrado){
            return res.render(
                'unidad/crear',
                {
                    error: parametrosConsulta.error,
                    unidad: unidadEncontrado
                }
            )
        } else {
            return res.redirect('/unidad/vista/inicio?mensaje=Unidad no encontrada')
        }
    }



    @Post('editarDesdeVista/:id')
    async editarDesdeVista(
        @Param() parametrosRuta,
        @Body() paramBody,
        @Res() res
    ){

        const unidadValidada = new UnidadUpdateDto()
        unidadValidada.id = Number(parametrosRuta.id)
        unidadValidada.nombre = paramBody.nombre


        const errores: ValidationError[] = await validate(unidadValidada)
        if(errores.length > 0){
            console.error('Errores:',errores);
            return res.redirect('/unidad/vista/inicio?mensaje= Error en el formato de los datos')
        } else {

            let error
            const re = /^[\p{L}'][ \p{L}'-]*[\p{L}]$/u;
            if(re.test(paramBody.nombre)) {

                const unidadEditada = {
                    unidadId: Number(parametrosRuta.id),
                    nombre: paramBody.nombre,
                } as UnidadEntity

                try {
                    await this._unidadService.editarUno(unidadEditada)
                    return res.redirect('/unidad/vista/inicio?mensaje= Unidad editada correctamente') // en caso de que all esté OK se envía al inicio
                } catch (e){
                    console.error(e)
                    error = 'Error editando Unidad'
                    return res.redirect('/unidad/vista/inicio?mensaje='+error)
                }
            } else {
                error = 'Caracteres no permitidos en el nombre'
                return res.redirect('/unidad/vista/crear?error='+error)
            }

        }

    }



    @Post('eliminarDesdeVista/:id')
    async eliminarDesdeVista(
        @Param() paramRuta,
        @Res() res,
    ){
        try{
            await this._unidadService.eliminarUno(Number(paramRuta.id))
            return res.redirect('/unidad/vista/inicio?mensaje= Unidad Eliminada')
        } catch(error){
            console.error(error)
            return res.redirect('/unidad/vista/inicio?error=Error eliminando unidad')
        }
    }

}
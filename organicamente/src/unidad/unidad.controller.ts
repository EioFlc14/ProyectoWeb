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
import {ProductoService} from "../producto/producto.service";
import {ProductoCreateDto} from "../producto/dto/producto.create-dto";
import {validate, ValidationError} from "class-validator";
import {UnidadService} from "./unidad.service";
import {UnidadCreateDto} from "./dto/unidad.create-dto";

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
            try {
                respuestaCreacionUnidad = await this._unidadService.crearUno(paramBody)
            } catch (e){
                console.error(e)
                const errorCreacion = 'Error al crear la Unidad'
                return res.redirect('/unidad/vista/crear?error='+errorCreacion+texto)
            }

            if(respuestaCreacionUnidad){
                return res.redirect('/unidad/vista/inicio') // en caso de que all esté OK se envía al inicio
            } else {
                const errorCreacion = 'Error al crear la Unidad'
                return res.redirect('/unidad/vista/crear?error='+errorCreacion+texto)
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
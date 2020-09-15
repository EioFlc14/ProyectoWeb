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
import {FacturaService} from "./factura.service";
import {FacturaCreateDto} from "./dto/factura.create-dto";
import {FacturaUpdateDto} from "./dto/factura.update-dto";
import {FacturaEntity} from "./factura.entity";


@Controller('factura')
export class FacturaController{

    constructor(
        private readonly _facturaService: FacturaService
    ) {
    }


    @Get('vista/inicio') // poner la direccion
    async obtenerFacturas(
        @Res() res
    ) {
        let resultadoEncontrado
        try {
            resultadoEncontrado = await this._facturaService.buscarTodos()
        } catch(error){
            throw new InternalServerErrorException('Error encontrando facturas')
        }


        if(resultadoEncontrado){
            console.log(resultadoEncontrado)
            return res.render('factura/inicio', {arregloFacturas: resultadoEncontrado}) // con esto mando resultadoEcontrado hasta usuario/inicio
        } else {
            throw new NotFoundException('NO se encontraron facturas')
        }
    }

    @Get('vista/crear')
    crearFacturaVista(
        @Query() parametrosConsulta,
        @Res() res
    ){
        return res.render('factura/crear',
            {
                error: parametrosConsulta.error,
                facturaId: parametrosConsulta.facturaId,
                total: parametrosConsulta.total,
                fecha: parametrosConsulta.fecha,
                cumplido: parametrosConsulta.cumplido,
                usuario: parametrosConsulta.usuario,
            })
    }

    //@Post()
    @Post('crearDesdeVista')
    async crearDesdeVista(
        @Body() paramBody,
        @Res() res,
    ){

        const today = new Date();
        const date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        const dateTime = date+' '+time;


        let respuestaCreacionFactura
        const facturaValidada = new FacturaCreateDto()
        facturaValidada.cumplido = paramBody.cumplido
        facturaValidada.usuarioId = paramBody.usuario

        //console.log(paramBody)

        const errores: ValidationError[] = await validate(facturaValidada)
        const texto = `&total=${paramBody.total}&fecha=${paramBody.fecha}&cumplido=${paramBody.cumplido}&usuario=${paramBody.usuario}`
        if(errores.length > 0){
            console.error('Errores:',errores);
            const error = 'Error en el formato de los datos'
            return res.redirect('/factura/vista/crear?error='+error+texto)
        } else {
            try {
                paramBody.total = 0.0
                paramBody.fecha = dateTime

                respuestaCreacionFactura = await this._facturaService.crearUno(paramBody)
                console.log("LO CREADO:*******" + respuestaCreacionFactura)


                // AQUI SE TIENE QUE CREAR TODOS LOS DETALLE FACTURAS, supongo que es un FOR.********************

            } catch (e){
                console.error(e)
                const errorCreacion = 'Error al crear la Factura'
                return res.redirect('/factura/vista/crear?error='+errorCreacion+texto)
            }

            if(respuestaCreacionFactura){
                return res.redirect('/factura/vista/inicio') // en caso de que all esté OK se envía al inicio
            } else {
                const errorCreacion = 'Error al crear la Factura'
                return res.redirect('/factura/vista/crear?error='+errorCreacion+texto)
            }
        }

    }


    @Get('vista/editar/:id') // Controlador
    async editarFacturaVista(
        @Query() parametrosConsulta,
        @Res() res,
        @Param() parametrosRuta
    ) {
        const id = Number(parametrosRuta.id)
        let facturaEncontrado

        try {
            facturaEncontrado = await this._facturaService.buscarUno(id)
        } catch (error) {
            console.error('Error del servidor')
            return res.redirect('/factura/vista/inicio?mensaje=Error buscando factura')
        }

        if (facturaEncontrado){
            console.log(facturaEncontrado)
            return res.render(
                'factura/crear',
                {
                    error: parametrosConsulta.error,
                    factura: facturaEncontrado
                }
            )
        } else {
            return res.redirect('/factura/vista/inicio?mensaje=Factura no encontrado')
        }
    }




   @Post('editarDesdeVista/:id')
    async editarDesdeVista(
        @Param() parametrosRuta,
        @Body() paramBody,
        @Res() res
    ){

        console.log('LLEGA:'+ paramBody)
        const facturaValidada = new FacturaUpdateDto()
        facturaValidada.id = Number(parametrosRuta.id)
        facturaValidada.fecha = paramBody.fecha
        facturaValidada.total = paramBody.total
        facturaValidada.cumplido = paramBody.cumplido
        //facturaValidada.usuarioId = paramBody.usuario.usuarioId

        const errores: ValidationError[] = await validate(facturaValidada)
        if(errores.length > 0){
            console.error('Errores:',errores);
            const error = 'Error en el formato de los datos'
            return res.redirect('/factura/vista/inicio?mensaje='+error)
        } else {

            const facturaEditado = {
                facturaId: Number(parametrosRuta.id),
                cumplido : paramBody.cumplido,
            } as FacturaEntity

            try {
                await this._facturaService.editarUno(facturaEditado)
                return res.redirect('/factura/vista/inicio?mensaje= Factura editada correctamente') // en caso de que all esté OK se envía al inicio
            } catch (e){
                console.error(e)
                const errorCreacion = 'Error editando Factura'
                return res.redirect('/factura/vista/inicio?mensaje='+errorCreacion)
            }
        }
    }



    @Post('eliminarDesdeVista/:id') // ESTA NO SE DEBE IMPLEMENTAR YA QUE NO SE PUEDE ELIMINAR UNA FACTURA PERO SE LA HIZO IGUALMENTE
    async eliminarDesdeVista(
        @Param() paramRuta,
        @Res() res,
    ){
        try{
            await this._facturaService.eliminarUno(Number(paramRuta.id))
            return res.redirect('/factura/vista/inicio?mensaje= Factura Eliminada')
        } catch(error){
            console.error(error)
            return res.redirect('/factura/vista/inicio?error=Error eliminando  Factura')
        }
    }

}
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
import {UsuarioService} from "../usuario/usuario.service";
import {UsuarioCreateDto} from "../usuario/dto/usuario.create-dto";
import {validate, ValidationError} from "class-validator";
import {FacturaService} from "./factura.service";
import {FacturaCreateDto} from "./dto/factura.create-dto";


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
                usuario: parametrosConsulta.usuarioUsuarioId,
            })
    }

    //@Post()
    @Post('crearDesdeVista')
    async crearDesdeVista(
        @Body() paramBody,
        @Res() res,
    ){
        let respuestaCreacionFactura
        const facturaValidada = new FacturaCreateDto()
        facturaValidada.total = paramBody.total
        facturaValidada.fecha = paramBody.fecha
        facturaValidada.cumplido = paramBody.cumplido
        facturaValidada.usuarioId = paramBody.usuarioUsuarioId

        console.log(paramBody)

        const errores: ValidationError[] = await validate(facturaValidada)
        const texto = `&total=${paramBody.total}&fecha=${paramBody.fecha}&cumplido=${paramBody.cumplido}&usuarioUsuarioId=${paramBody.usuarioUsuarioId}`
        if(errores.length > 0){
            console.error('Errores:',errores);
            const error = 'Error en el formato de los datos'
            return res.redirect('/factura/vista/crear?error='+error+texto)
        } else {
            try {
                respuestaCreacionFactura = await this._facturaService.crearUno(paramBody)
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
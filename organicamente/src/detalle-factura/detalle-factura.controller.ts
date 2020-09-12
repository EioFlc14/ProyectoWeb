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
import {FacturaService} from "../factura/factura.service";
import {FacturaCreateDto} from "../factura/dto/factura.create-dto";
import {validate, ValidationError} from "class-validator";
import {DetalleFacturaService} from "./detalle-factura.service";
import {DetalleFacturaCreateDto} from "./dto/detalle-factura.create-dto";
import {UsuarioService} from "../usuario/usuario.service";
import {UsuarioUpdateDto} from "../usuario/dto/usuario.update-dto";
import {UsuarioEntity} from "../usuario/usuario.entity";


@Controller('detalle-factura')
export class DetalleFacturaController{

    constructor(
        private readonly _detalleFacturaService: DetalleFacturaService,
        private readonly _usuarioService: UsuarioService
    ) {
    }


    @Get('vista/inicio') // poner la direccion
    async obtenerDetallesFacturas(
        @Res() res
    ) {
        let resultadoEncontrado
        try {
            resultadoEncontrado = await this._detalleFacturaService.buscarTodos()

        } catch(error){
            throw new InternalServerErrorException('Error encontrando Detalle Factura')
        }

        console.log(resultadoEncontrado)
        if(resultadoEncontrado){
            return res.render('detalle-factura/inicio', {arregloDetalleFacturas: resultadoEncontrado}) // con esto mando resultadoEcontrado hasta usuario/inicio
        } else {
            throw new NotFoundException('NO se encontraron facturas')
        }
    }

    @Get('vista/crear')
    crearDetalleFacturaVista(
        @Query() parametrosConsulta,
        @Res() res
    ){
        return res.render('detalle-factura/crear',
            {
                error: parametrosConsulta.error,
                cantidad: parametrosConsulta.cantidad,
                precio: parametrosConsulta.precio,
                valor: parametrosConsulta.valor,
                usuarioProducto: parametrosConsulta.usuarioProducto,
                factura: parametrosConsulta.factura,
            })
    }

    //@Post()
    @Post('crearDesdeVista')
    async crearDesdeVista(
        @Body() paramBody,
        @Res() res,
    ){
        let respuestaCreacionFactura
        const detalleFacturaValidada = new DetalleFacturaCreateDto()
        detalleFacturaValidada.cantidad = paramBody.cantidad
        detalleFacturaValidada.precio = paramBody.precio
        detalleFacturaValidada.valor = paramBody.valor
        detalleFacturaValidada.usuarioProductoId = paramBody.usuarioProducto
        detalleFacturaValidada.facturaId = paramBody.factura

        console.log(paramBody)

        const errores: ValidationError[] = await validate(detalleFacturaValidada)
        const texto = `&cantidad=${paramBody.cantidad}&precio=${paramBody.precio}&valor=${paramBody.valor}&usuarioProducto=${paramBody.usuarioProducto}&factura=${paramBody.factura}`
        if(errores.length > 0){
            console.error('Errores:',errores);
            const error = 'Error en el formato de los datos'
            return res.redirect('/detalle-factura/vista/crear?error='+error+texto)
        } else {
            try {
                paramBody.cantidad = Number(paramBody.cantidad)
                paramBody.precio = Number(paramBody.precio)
                paramBody.valor = Number(paramBody.valor)
                paramBody.usuarioProducto = Number(paramBody.usuarioProducto)
                paramBody.factura = Number(paramBody.factura)

                respuestaCreacionFactura = await this._detalleFacturaService.crearUno(paramBody)
            } catch (e){
                console.error(e)
                const errorCreacion = 'Error al crear el Detalle Factura.'
                return res.redirect('/detalle-factura/vista/crear?error='+errorCreacion+texto)
            }

            if(respuestaCreacionFactura){
                return res.redirect('/detalle-factura/vista/inicio') // en caso de que all esté OK se envía al inicio
            } else {
                const errorCreacion = 'Error al crear el Detalle Factura'
                return res.redirect('/detalle-factura/vista/crear?error='+errorCreacion+texto)
            }
        }
    }


    @Post('eliminarDesdeVista/:id')  // ESTA NO SE DEBE IMPLEMENTAR YA QUE NO SE PUEDE ELIMINAR UN DETALLE FACTURA PERO SE LA HIZO IGUALMENTE
    async eliminarDesdeVista(
        @Param() paramRuta,
        @Res() res,
    ){
        try{
            await this._detalleFacturaService.eliminarUno(Number(paramRuta.id))
            return res.redirect('/detalle-factura/vista/inicio?mensaje= Detalle Factura Eliminada')
        } catch(error){
            console.error(error)
            return res.redirect('/detalle-factura/vista/inicio?error=Error eliminando Detalle Factura')
        }
    }


}
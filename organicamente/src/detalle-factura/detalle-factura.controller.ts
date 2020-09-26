import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    Query,
    Res
} from "@nestjs/common";
import {validate, ValidationError} from "class-validator";
import {DetalleFacturaService} from "./detalle-factura.service";
import {DetalleFacturaCreateDto} from "./dto/detalle-factura.create-dto";
import {UsuarioService} from "../usuario/usuario.service";


@Controller('detalle-factura')
export class DetalleFacturaController {

    constructor(
        private readonly _detalleFacturaService: DetalleFacturaService,
        private readonly _usuarioService: UsuarioService
    ) {
    }

    /*

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


        @Post('crearDesdeVista')
        async crearDesdeVista(
            @Body() paramBody,
            @Res() res,
        ){
            let respuestaCreacionFactura
            const detalleFacturaValidada = new DetalleFacturaCreateDto()
            detalleFacturaValidada.cantidad = Number(paramBody.cantidad)
            detalleFacturaValidada.precio = Number(paramBody.precio)
            detalleFacturaValidada.valor = Number(paramBody.valor)
            detalleFacturaValidada.usuarioProductoId = Number(paramBody.usuarioProducto)
            detalleFacturaValidada.facturaId = Number(paramBody.factura)

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
    */


}
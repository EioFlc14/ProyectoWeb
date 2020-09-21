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
import {UsuarioProductoService} from "../usuario-producto/usuario-producto.service";
import {DetalleFacturaService} from "../detalle-factura/detalle-factura.service";
import {pseudoRandomBytes} from "crypto";
import {DetalleFacturaEntity} from "../detalle-factura/detalle-factura.entity";


@Controller('factura')
export class FacturaController {

    constructor(
        private readonly _facturaService: FacturaService,
        private readonly _usuarioProductoService: UsuarioProductoService,
        private readonly _detalleFacturaService: DetalleFacturaService,
    ) {
    }


    /*  @Get('vista/inicio') // poner la direccion
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
      } */


    @Get('vista/inicio/:id')   // para el productor - MIS PEDIDOS
    async obtenerFacturasEspecificas(
        @Res() res,
        @Param() parametrosRuta
    ) {
        let resultadoEncontrado
        try {
            const id = Number(parametrosRuta.id)
            resultadoEncontrado = await this._facturaService.buscarFacturasEspecificas(id)
        } catch (error) {
            throw new InternalServerErrorException('Error encontrando facturas')
        }


        if (resultadoEncontrado) {
            console.log(resultadoEncontrado)
            return res.render('factura/inicio', {arregloFacturas: resultadoEncontrado}) // con esto mando resultadoEcontrado hasta usuario/inicio
        } else {
            throw new NotFoundException('NO se encontraron facturas')
        }
    }


    @Get('vista/inicio/usuario/:id') // para el cliente - MIS PEDIDOS
    async obtenerFacturasUnUsuario(
        @Res() res,
        @Param() paramRuta
    ) {
        let resultadoEncontrado
        const id = Number(paramRuta.id)
        if (id === undefined) {
            try {
                resultadoEncontrado = await this._facturaService.buscarTodosUnUsuario(id)

                if (resultadoEncontrado) {
                    console.log(resultadoEncontrado)
                    return res.render('factura/inicio', {arregloFacturas: resultadoEncontrado}) // con esto mando resultadoEcontrado hasta usuario/inicio
                } else {
                    throw new NotFoundException('NO se encontraron facturas')
                }

            } catch (error) {
                throw new InternalServerErrorException('Error encontrando facturas')
            }
        } else {
            throw new InternalServerErrorException('Error encontrando facturas')
        }


    }


    @Get('vista/crear/:id')
    async crearFacturaVista( // esto debe cambiar para adaptar con lo que envio desde el boton comprar
        @Param() parametrosConsulta,
        @Res() res
    ) {
        const id = Number(parametrosConsulta.id)
        let productoComprar

        try {
            productoComprar = await this._usuarioProductoService.buscarUno(id)
        } catch (error) {
            throw new NotFoundException('Error obteniendo datos.')
        }

        if (productoComprar) {
            console.log(productoComprar)
            return res.render('factura/crear',
                {
                    error: parametrosConsulta.error,
                    producto: productoComprar,
                })
        } else {
            // mandar a la principal diciendo que no se pudo obtener los productos
            throw new NotFoundException('No hay suficientes datos para esta acción. Inténtelo más tarde.')
        }

    }


    //@Post()
    @Post('crearDesdeVista') // esto se va a mantener
    async crearDesdeVista(
        @Body() paramBody,
        @Query() paramConsulta,
        @Res() res,
    ) {

        console.log("PARAM BODY:" + paramBody.precio)
        console.log("PARAM BODY:" + paramBody.cantidad)
        console.log("PARAM BODY:" + paramBody.total)
        const today = new Date();
        const cumplido = 'No'
        const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        const dateTime = date + ' ' + time;

        paramBody.usuario = '3' // ************** ESTE VALOR SE LO DEBE SACAR DE LA SESIÓN.

        let respuestaCreacionFactura
        const facturaValidada = new FacturaCreateDto()
        facturaValidada.cumplido = cumplido
        facturaValidada.usuarioId = paramBody.usuario
        facturaValidada.total = paramBody.total

        //console.log(paramBody)

        const errores: ValidationError[] = await validate(facturaValidada)
        //const texto = `&total=${paramBody.total}&fecha=${paramBody.fecha}&cumplido=${paramBody.cumplido}&usuario=${paramBody.usuario}`
        if (errores.length > 0) {
            console.error('Errores:', errores);
            const error = 'Error en el formato de los datos'
            return res.redirect('/principal?error=' + error)
        } else {
            try {
                paramBody.total = Number(paramBody.total)
                paramBody.fecha = dateTime
                paramBody.cumplido = cumplido
                paramBody.usuario = Number(paramBody.usuario)

                respuestaCreacionFactura = await this._facturaService.crearUno(paramBody)

                if (respuestaCreacionFactura) {
                    let respuestaCreacionDetalleFactura
                    const detalleFactura = {
                        cantidad: Number(paramBody.cantidad),
                        precio: Number(paramBody.precio),
                        valor: Number(paramBody.total),
                        usuarioProducto: Number(paramConsulta.usuarioProducto),
                        factura: Number(respuestaCreacionFactura.facturaId)
                    } as unknown as DetalleFacturaEntity

                    respuestaCreacionDetalleFactura = await this._detalleFacturaService.crearUno(detalleFactura)

                    if (respuestaCreacionDetalleFactura) {
                        const mensaje = 'Orden registrada exitosamente.'
                        return res.redirect('/principal?exito=' + mensaje) // en caso de que all esté OK se envía al inicio
                    } else {
                        const errorCreacion = 'Error al registrar la orden.'
                        return res.redirect('/principal?error=' + errorCreacion)
                    }
                } else {
                    const errorCreacion = 'Error al registrar la orden.'
                    return res.redirect('/principal?error=' + errorCreacion)
                }

            } catch (e) {
                console.error(e)
                const errorCreacion = 'Error al registrar la orden.'
                return res.redirect('/principal?error=' + errorCreacion)
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
        let detalleFacturaEncontrado

        try {
            facturaEncontrado = await this._facturaService.buscarUno(id)
            detalleFacturaEncontrado = await this._detalleFacturaService.buscarTodos(id)

        } catch (error) {
            console.error('Error del servidor')
            return res.redirect('/factura/vista/inicio?mensaje=Error obteniendo datos.')
        }

        if (facturaEncontrado && detalleFacturaEncontrado) {
            console.log(facturaEncontrado)
            console.log("DETALLE FACTURA:" + detalleFacturaEncontrado)
            return res.render(
                'factura/editar',
                {
                    error: parametrosConsulta.error,
                    factura: facturaEncontrado,
                    orden: detalleFacturaEncontrado,
                }
            )
        } else {
            return res.redirect('/factura/vista/inicio?mensaje=No hay suficientes datos para realizar esta acción. Inténtelo más tarde')
        }
    }


    @Post('editarDesdeVista/:id')
    async editarDesdeVista(
        @Param() parametrosRuta,
        @Body() paramBody,
        @Res() res
    ) {

        console.log('LLEGA:' + paramBody)
        const facturaValidada = new FacturaUpdateDto()
        facturaValidada.id = Number(parametrosRuta.id)
        facturaValidada.cumplido = paramBody.cumplido

        const errores: ValidationError[] = await validate(facturaValidada)
        if (errores.length > 0) {
            console.error('Errores:', errores);
            const error = 'Error en el formato de los datos'
            return res.redirect('/factura/vista/inicio?mensaje=' + error)
        } else {

            const facturaEditado = {
                facturaId: Number(parametrosRuta.id),
                cumplido: paramBody.cumplido,
            } as FacturaEntity

            try {
                await this._facturaService.editarUno(facturaEditado)
                return res.redirect('/factura/vista/inicio?mensaje= Factura editada correctamente') // en caso de que all esté OK se envía al inicio
            } catch (e) {
                console.error(e)
                const errorCreacion = 'Error editando Factura'
                return res.redirect('/factura/vista/inicio?mensaje=' + errorCreacion)
            }
        }
    }


    @Post('eliminarDesdeVista/:id') // ESTA NO SE DEBE IMPLEMENTAR YA QUE NO SE PUEDE ELIMINAR UNA FACTURA PERO SE LA HIZO IGUALMENTE
    async eliminarDesdeVista(
        @Param() paramRuta,
        @Res() res,
    ) {
        try {
            await this._facturaService.eliminarUno(Number(paramRuta.id))
            return res.redirect('/factura/vista/inicio?mensaje= Factura Eliminada')
        } catch (error) {
            console.error(error)
            return res.redirect('/factura/vista/inicio?error=Error eliminando  Factura')
        }
    }

}
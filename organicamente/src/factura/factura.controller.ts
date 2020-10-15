import {
    Body,
    Controller,
    Get,
    InternalServerErrorException,
    NotFoundException,
    Param,
    Post,
    Query,
    Res, Session
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


    @Get('vista/inicio/:rol')
    async obtenerFacturasUnUsuario(
        @Res() res,
        @Param() paramRuta,
        @Query() parametrosConsulta,
        @Session() session,
    ) {
        if (session.usuarioId) {
            const id = session.usuarioId
            if (id != undefined && paramRuta.rol != undefined) {
                try {
                    if (parametrosConsulta.busqueda == undefined) {
                        parametrosConsulta.busqueda = ''
                    }

                    let resultadoEncontrado
                    if (paramRuta.rol == 'cliente') {
                        resultadoEncontrado = await this._facturaService.buscarTodosUnUsuario(id, parametrosConsulta.busqueda)
                    } else if (paramRuta.rol == 'productor') {
                        resultadoEncontrado = await this._facturaService.buscarFacturasEspecificas(id, parametrosConsulta.busqueda)
                    } else if (paramRuta.rol == 'admin') {
                        resultadoEncontrado = await this._facturaService.buscarTodos(parametrosConsulta.busqueda)
                    }
                    const esAdministrador = session.roles.some((rol) => rol == 'administrador')
                    const esProductor = session.roles.some((rol) => rol == 'productor')
                    const esCliente = session.roles.some((rol) => rol == 'cliente')


                    if (resultadoEncontrado) {
                        console.log(resultadoEncontrado)
                        return res.render('factura/inicio',
                            {
                                arregloFacturas: resultadoEncontrado,
                                rol: paramRuta.rol,
                                id: session.usuarioId,
                                esAdministrador: esAdministrador,
                                esProductor: esProductor,
                                esCliente: esCliente,
                            })
                    } else {
                        const errorCreacion = 'No se encontraron facturas para mostrar.'
                        return res.redirect('/principal?error=' + errorCreacion)
                    }

                } catch (error) {
                    const errorCreacion = 'Error al buscar facturas. Inténtelo más tarde.'
                    return res.redirect('/principal?error=' + errorCreacion)
                }
            } else {
                const errorCreacion = 'Error al buscar facturas. Inténtelo más tarde.'
                return res.redirect('/principal?error=' + errorCreacion)
            }
        } else {
            return res.redirect('/login')
        }
    }


    @Get('vista/crear/:id')
    async crearFacturaVista(
        @Param() parametrosBody,
        @Query() parametrosConsulta,
        @Res() res,
        @Session() session,
    ) {
        if (session.usuarioId) {
            const id = Number(parametrosBody.id)
            let productoComprar
            let error

            try {
                productoComprar = await this._usuarioProductoService.buscarUno(id)
            } catch (e) {
                console.log(e)
                error = 'Error al obtener datos. Inténtelo más tarde.'
                return res.redirect('/principal?error=' + error)
            }

            const esAdministrador = session.roles.some((rol) => rol == 'administrador')
            const esProductor = session.roles.some((rol) => rol == 'productor')
            const esCliente = session.roles.some((rol) => rol == 'cliente')

            if (productoComprar) {
                console.log(productoComprar)
                return res.render('factura/crear',
                    {
                        error: parametrosConsulta.error,
                        producto: productoComprar,
                        id: session.usuarioId,
                        esAdministrador:esAdministrador,
                        esProductor: esProductor,
                        esCliente: esCliente,
                    })
            } else {
                error = 'Error al obtener datos. Inténtelo más tarde.'
                return res.redirect('/principal?error=' + error)
            }

        } else {
            return res.redirect('/login')
        }

    }


    @Post('crearDesdeVista')
    async crearDesdeVista(
        @Body() paramBody,
        @Query() paramConsulta,
        @Res() res,
        @Session() session,
    ) {

        if (session.usuarioId) {
            const today = new Date();
            const cumplido = 'No'
            const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
            const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
            const dateTime = date + ' ' + time;

            paramBody.usuario = session.usuarioId

            let respuestaCreacionFactura
            const facturaValidada = new FacturaCreateDto()
            facturaValidada.cumplido = cumplido
            facturaValidada.total = paramBody.total

            const errores: ValidationError[] = await validate(facturaValidada)
            if (errores.length > 0) {
                console.log(errores)
                const error = 'Error en el formato de los datos'
                return res.redirect('/principal?error=' + error)
            } else {
                try {
                    paramBody.total = Number(paramBody.total)
                    paramBody.fecha = dateTime
                    paramBody.cumplido = cumplido
                    paramBody.usuario = Number(paramBody.usuario)

                    if (paramBody.total <= 0.0) {
                        const error = 'Debe ingresar una cantidad entera válida mayor a 0.'
                        return res.redirect('/factura/vista/crear/' + Number(paramConsulta.usuarioProducto) + '?error=' + error)
                    } else {
                        const validarCantidad = await this._usuarioProductoService.buscarUno(Number(paramConsulta.usuarioProducto))

                        if (Number(paramBody.cantidad) <= validarCantidad.stock) {
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
                                    return res.redirect('/principal?exito=' + mensaje)
                                } else {
                                    const errorCreacion = 'Error al registrar la orden.'
                                    return res.redirect('/principal?error=' + errorCreacion)
                                }
                            } else {
                                const errorCreacion = 'Error al registrar la orden.'
                                return res.redirect('/principal?error=' + errorCreacion)
                            }
                        } else {
                            const mensaje = 'Stock insuficiente.'
                            return res.redirect('/factura/vista/crear/' + Number(paramConsulta.usuarioProducto) + '?error=' + mensaje)
                        }
                    }
                } catch (e) {
                    console.error(e)
                    const errorCreacion = 'Error al registrar la orden.'
                    return res.redirect('/principal?error=' + errorCreacion)
                }
            }
        } else {
            return res.redirect('/login')
        }

    }


    @Get('vista/editar/:rol/:idFactura')
    async editarFacturaVista(
        @Query() parametrosConsulta,
        @Res() res,
        @Param() parametrosRuta,
        @Session() session,
    ) {
        if (session.usuarioId) {
            const id = Number(parametrosRuta.idFactura)
            let facturaEncontrada

            try {
                facturaEncontrada = await this._facturaService.buscarUno(id)
            } catch (error) {
                console.error('Error del servidor')
                return res.redirect('/principal?error=Error obteniendo datos.')
            }

            const esAdministrador = session.roles.some((rol) => rol == 'administrador')
            const esProductor = session.roles.some((rol) => rol == 'productor')
            const esCliente = session.roles.some((rol) => rol == 'cliente')

            if (facturaEncontrada) {
                return res.render(
                    'factura/editar',
                    {
                        error: parametrosConsulta.error,
                        factura: facturaEncontrada[0],
                        rol: parametrosRuta.rol,
                        id: session.usuarioId,
                        esAdministrador:esAdministrador,
                        esProductor: esProductor,
                        esCliente: esCliente,
                    }
                )
            } else {
                return res.redirect('/principal?error=No hay suficientes datos para realizar esta acción. Inténtelo más tarde')
            }

        } else {
            return res.redirect('/login')
        }
    }


    @Get('editarDesdeVista/:idFactura')
    async editarDesdeVista(
        @Param() parametrosRuta,
        @Body() paramBody,
        @Res() res,
        @Session() session,
    ) {
        if (session.usuarioId) {
            const cumplido = 'Si'
            const facturaValidada = new FacturaUpdateDto()
            facturaValidada.id = Number(parametrosRuta.idFactura)
            facturaValidada.cumplido = cumplido

            const errores: ValidationError[] = await validate(facturaValidada)
            if (errores.length > 0) {
                const error = 'Error al marcar la orden como cumplida.'
                return res.redirect('/principal?error=' + error)
            } else {
                const facturaEditado = {
                    facturaId: Number(parametrosRuta.idFactura),
                    cumplido: cumplido,
                } as FacturaEntity

                try {
                    await this._facturaService.editarUno(facturaEditado)
                    return res.redirect('/principal?exito= Se orden ha sido marcada como cumplida correctamente.')
                } catch (e) {
                    console.error(e)
                    const error = 'Error al marcar la orden como cumplida.'
                    return res.redirect('/principal?error=' + error)
                }
            }
        } else {
            return res.redirect('/login')
        }
    }


}
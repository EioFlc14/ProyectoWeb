"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FacturaController = void 0;
const common_1 = require("@nestjs/common");
const class_validator_1 = require("class-validator");
const factura_service_1 = require("./factura.service");
const factura_create_dto_1 = require("./dto/factura.create-dto");
const factura_update_dto_1 = require("./dto/factura.update-dto");
const usuario_producto_service_1 = require("../usuario-producto/usuario-producto.service");
const detalle_factura_service_1 = require("../detalle-factura/detalle-factura.service");
let FacturaController = class FacturaController {
    constructor(_facturaService, _usuarioProductoService, _detalleFacturaService) {
        this._facturaService = _facturaService;
        this._usuarioProductoService = _usuarioProductoService;
        this._detalleFacturaService = _detalleFacturaService;
    }
    async obtenerFacturasUnUsuario(res, paramRuta, parametrosConsulta, session) {
        if (session.usuarioId) {
            const id = session.usuarioId;
            if (id != undefined && paramRuta.rol != undefined) {
                try {
                    if (parametrosConsulta.busqueda == undefined) {
                        parametrosConsulta.busqueda = '';
                    }
                    let resultadoEncontrado;
                    if (paramRuta.rol == 'cliente') {
                        resultadoEncontrado = await this._facturaService.buscarTodosUnUsuario(id, parametrosConsulta.busqueda);
                    }
                    else if (paramRuta.rol == 'productor') {
                        resultadoEncontrado = await this._facturaService.buscarFacturasEspecificas(id, parametrosConsulta.busqueda);
                    }
                    else if (paramRuta.rol == 'admin') {
                        resultadoEncontrado = await this._facturaService.buscarTodos(parametrosConsulta.busqueda);
                    }
                    const esAdministrador = session.roles.some((rol) => rol == 'administrador');
                    const esProductor = session.roles.some((rol) => rol == 'productor');
                    const esCliente = session.roles.some((rol) => rol == 'cliente');
                    if (resultadoEncontrado) {
                        console.log(resultadoEncontrado);
                        return res.render('factura/inicio', {
                            arregloFacturas: resultadoEncontrado,
                            rol: paramRuta.rol,
                            id: session.usuarioId,
                            esAdministrador: esAdministrador,
                            esProductor: esProductor,
                            esCliente: esCliente,
                        });
                    }
                    else {
                        const errorCreacion = 'No se encontraron facturas para mostrar.';
                        return res.redirect('/principal?error=' + errorCreacion);
                    }
                }
                catch (error) {
                    const errorCreacion = 'Error al buscar facturas. Inténtelo más tarde.';
                    return res.redirect('/principal?error=' + errorCreacion);
                }
            }
            else {
                const errorCreacion = 'Error al buscar facturas. Inténtelo más tarde.';
                return res.redirect('/principal?error=' + errorCreacion);
            }
        }
        else {
            return res.redirect('/login');
        }
    }
    async crearFacturaVista(parametrosBody, parametrosConsulta, res, session) {
        if (session.usuarioId) {
            const id = Number(parametrosBody.id);
            let productoComprar;
            let error;
            try {
                productoComprar = await this._usuarioProductoService.buscarUno(id);
            }
            catch (e) {
                console.log(e);
                error = 'Error al obtener datos. Inténtelo más tarde.';
                return res.redirect('/principal?error=' + error);
            }
            const esAdministrador = session.roles.some((rol) => rol == 'administrador');
            const esProductor = session.roles.some((rol) => rol == 'productor');
            const esCliente = session.roles.some((rol) => rol == 'cliente');
            if (productoComprar) {
                console.log(productoComprar);
                return res.render('factura/crear', {
                    error: parametrosConsulta.error,
                    producto: productoComprar,
                    id: session.usuarioId,
                    esAdministrador: esAdministrador,
                    esProductor: esProductor,
                    esCliente: esCliente,
                });
            }
            else {
                error = 'Error al obtener datos. Inténtelo más tarde.';
                return res.redirect('/principal?error=' + error);
            }
        }
        else {
            return res.redirect('/login');
        }
    }
    async crearDesdeVista(paramBody, paramConsulta, res, session) {
        if (session.usuarioId) {
            const today = new Date();
            const cumplido = 'No';
            const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
            const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
            const dateTime = date + ' ' + time;
            paramBody.usuario = session.usuarioId;
            let respuestaCreacionFactura;
            const facturaValidada = new factura_create_dto_1.FacturaCreateDto();
            facturaValidada.cumplido = cumplido;
            facturaValidada.total = paramBody.total;
            const errores = await class_validator_1.validate(facturaValidada);
            if (errores.length > 0) {
                console.log(errores);
                const error = 'Error en el formato de los datos';
                return res.redirect('/principal?error=' + error);
            }
            else {
                try {
                    paramBody.total = Number(paramBody.total);
                    paramBody.fecha = dateTime;
                    paramBody.cumplido = cumplido;
                    paramBody.usuario = Number(paramBody.usuario);
                    if (paramBody.total <= 0.0) {
                        const error = 'Debe ingresar una cantidad entera válida mayor a 0.';
                        return res.redirect('/factura/vista/crear/' + Number(paramConsulta.usuarioProducto) + '?error=' + error);
                    }
                    else {
                        const validarCantidad = await this._usuarioProductoService.buscarUno(Number(paramConsulta.usuarioProducto));
                        if (Number(paramBody.cantidad) <= validarCantidad.stock) {
                            respuestaCreacionFactura = await this._facturaService.crearUno(paramBody);
                            if (respuestaCreacionFactura) {
                                let respuestaCreacionDetalleFactura;
                                const detalleFactura = {
                                    cantidad: Number(paramBody.cantidad),
                                    precio: Number(paramBody.precio),
                                    valor: Number(paramBody.total),
                                    usuarioProducto: Number(paramConsulta.usuarioProducto),
                                    factura: Number(respuestaCreacionFactura.facturaId)
                                };
                                respuestaCreacionDetalleFactura = await this._detalleFacturaService.crearUno(detalleFactura);
                                if (respuestaCreacionDetalleFactura) {
                                    const mensaje = 'Orden registrada exitosamente.';
                                    return res.redirect('/principal?exito=' + mensaje);
                                }
                                else {
                                    const errorCreacion = 'Error al registrar la orden.';
                                    return res.redirect('/principal?error=' + errorCreacion);
                                }
                            }
                            else {
                                const errorCreacion = 'Error al registrar la orden.';
                                return res.redirect('/principal?error=' + errorCreacion);
                            }
                        }
                        else {
                            const mensaje = 'Stock insuficiente.';
                            return res.redirect('/factura/vista/crear/' + Number(paramConsulta.usuarioProducto) + '?error=' + mensaje);
                        }
                    }
                }
                catch (e) {
                    console.error(e);
                    const errorCreacion = 'Error al registrar la orden.';
                    return res.redirect('/principal?error=' + errorCreacion);
                }
            }
        }
        else {
            return res.redirect('/login');
        }
    }
    async editarFacturaVista(parametrosConsulta, res, parametrosRuta, session) {
        if (session.usuarioId) {
            const id = Number(parametrosRuta.idFactura);
            let facturaEncontrada;
            try {
                facturaEncontrada = await this._facturaService.buscarUno(id);
            }
            catch (error) {
                console.error('Error del servidor');
                return res.redirect('/principal?error=Error obteniendo datos.');
            }
            const esAdministrador = session.roles.some((rol) => rol == 'administrador');
            const esProductor = session.roles.some((rol) => rol == 'productor');
            const esCliente = session.roles.some((rol) => rol == 'cliente');
            if (facturaEncontrada) {
                return res.render('factura/editar', {
                    error: parametrosConsulta.error,
                    factura: facturaEncontrada[0],
                    rol: parametrosRuta.rol,
                    id: session.usuarioId,
                    esAdministrador: esAdministrador,
                    esProductor: esProductor,
                    esCliente: esCliente,
                });
            }
            else {
                return res.redirect('/principal?error=No hay suficientes datos para realizar esta acción. Inténtelo más tarde');
            }
        }
        else {
            return res.redirect('/login');
        }
    }
    async editarDesdeVista(parametrosRuta, paramBody, res, session) {
        if (session.usuarioId) {
            const cumplido = 'Si';
            const facturaValidada = new factura_update_dto_1.FacturaUpdateDto();
            facturaValidada.id = Number(parametrosRuta.idFactura);
            facturaValidada.cumplido = cumplido;
            const errores = await class_validator_1.validate(facturaValidada);
            if (errores.length > 0) {
                const error = 'Error al marcar la orden como cumplida.';
                return res.redirect('/principal?error=' + error);
            }
            else {
                const facturaEditado = {
                    facturaId: Number(parametrosRuta.idFactura),
                    cumplido: cumplido,
                };
                try {
                    await this._facturaService.editarUno(facturaEditado);
                    return res.redirect('/principal?exito= Se orden ha sido marcada como cumplida correctamente.');
                }
                catch (e) {
                    console.error(e);
                    const error = 'Error al marcar la orden como cumplida.';
                    return res.redirect('/principal?error=' + error);
                }
            }
        }
        else {
            return res.redirect('/login');
        }
    }
};
__decorate([
    common_1.Get('vista/inicio/:rol'),
    __param(0, common_1.Res()),
    __param(1, common_1.Param()),
    __param(2, common_1.Query()),
    __param(3, common_1.Session()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], FacturaController.prototype, "obtenerFacturasUnUsuario", null);
__decorate([
    common_1.Get('vista/crear/:id'),
    __param(0, common_1.Param()),
    __param(1, common_1.Query()),
    __param(2, common_1.Res()),
    __param(3, common_1.Session()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], FacturaController.prototype, "crearFacturaVista", null);
__decorate([
    common_1.Post('crearDesdeVista'),
    __param(0, common_1.Body()),
    __param(1, common_1.Query()),
    __param(2, common_1.Res()),
    __param(3, common_1.Session()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], FacturaController.prototype, "crearDesdeVista", null);
__decorate([
    common_1.Get('vista/editar/:rol/:idFactura'),
    __param(0, common_1.Query()),
    __param(1, common_1.Res()),
    __param(2, common_1.Param()),
    __param(3, common_1.Session()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], FacturaController.prototype, "editarFacturaVista", null);
__decorate([
    common_1.Get('editarDesdeVista/:idFactura'),
    __param(0, common_1.Param()),
    __param(1, common_1.Body()),
    __param(2, common_1.Res()),
    __param(3, common_1.Session()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], FacturaController.prototype, "editarDesdeVista", null);
FacturaController = __decorate([
    common_1.Controller('factura'),
    __metadata("design:paramtypes", [factura_service_1.FacturaService,
        usuario_producto_service_1.UsuarioProductoService,
        detalle_factura_service_1.DetalleFacturaService])
], FacturaController);
exports.FacturaController = FacturaController;
//# sourceMappingURL=factura.controller.js.map
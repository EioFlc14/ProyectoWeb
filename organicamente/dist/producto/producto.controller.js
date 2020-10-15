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
exports.ProductoController = void 0;
const common_1 = require("@nestjs/common");
const class_validator_1 = require("class-validator");
const producto_service_1 = require("./producto.service");
const producto_create_dto_1 = require("./dto/producto.create-dto");
const producto_update_dto_1 = require("./dto/producto.update-dto");
let ProductoController = class ProductoController {
    constructor(_productoService) {
        this._productoService = _productoService;
    }
    async obtenerProductos(res, parametrosConsulta, session) {
        if (session.usuarioId) {
            let resultadoEncontrado;
            try {
                resultadoEncontrado = await this._productoService.buscarTodos();
            }
            catch (e) {
                const error = 'Error al obtener datos.';
                return res.redirect('/principal?error=' + error);
            }
            const esAdministrador = session.roles.some((rol) => rol == 'administrador');
            const esProductor = session.roles.some((rol) => rol == 'productor');
            const esCliente = session.roles.some((rol) => rol == 'cliente');
            if (resultadoEncontrado) {
                console.log(resultadoEncontrado);
                return res.render('producto/inicio', {
                    arregloProductos: resultadoEncontrado,
                    error: parametrosConsulta.error,
                    id: session.usuarioId,
                    esAdministrador: esAdministrador,
                    esProductor: esProductor,
                    esCliente: esCliente,
                });
            }
            else {
                const error = 'Error al obtener datos.';
                return res.redirect('/principal?error=' + error);
            }
        }
        else {
            return res.redirect('/login');
        }
    }
    crearProductoVista(parametrosConsulta, res, session) {
        if (session.usuarioId) {
            const esAdministrador = session.roles.some((rol) => rol == 'administrador');
            const esProductor = session.roles.some((rol) => rol == 'productor');
            const esCliente = session.roles.some((rol) => rol == 'cliente');
            return res.render('producto/crear', {
                error: parametrosConsulta.error,
                nombre: parametrosConsulta.nombre,
                id: session.usuarioId,
                esAdministrador: esAdministrador,
                esProductor: esProductor,
                esCliente: esCliente,
            });
        }
        else {
            return res.redirect('/login');
        }
    }
    async crearDesdeVista(paramBody, res, session) {
        if (session.usuarioId) {
            let respuestaCreacionProducto;
            const productoCreado = new producto_create_dto_1.ProductoCreateDto();
            productoCreado.nombre = paramBody.nombre;
            const texto = `&nombre=${paramBody.nombre}`;
            let error;
            const errores = await class_validator_1.validate(productoCreado);
            if (errores.length > 0) {
                console.error('Errores:', errores);
                error = 'Error en el formato de los datos';
                return res.redirect('/producto/vista/inicio?error=' + error + texto);
            }
            else {
                const re = /^[\p{L}'][ \p{L}'-]*[\p{L}]$/u;
                if (re.test(paramBody.nombre)) {
                    console.log(paramBody.nombre);
                    try {
                        respuestaCreacionProducto = await this._productoService.crearUno(paramBody);
                    }
                    catch (e) {
                        console.error(e);
                        error = 'Error al crear el Producto';
                        return res.redirect('/producto/vista/inicio?error=' + error + texto);
                    }
                    if (respuestaCreacionProducto) {
                        const exito = 'Producto creado exitosamente.';
                        return res.redirect('/principal?exito=' + exito);
                    }
                    else {
                        error = 'Error al crear el Producto';
                        return res.redirect('/principal?error=' + error + texto);
                    }
                }
                else {
                    error = 'Caracteres no permitidos en el nombre';
                    return res.redirect('/producto/vista/inicio?error=' + error + texto);
                }
            }
        }
        else {
            return res.redirect('/login');
        }
    }
    async editarProductoVista(parametrosConsulta, res, parametrosRuta, session) {
        if (session.usuarioId) {
            const id = Number(parametrosRuta.idProducto);
            let productoEncontrado;
            try {
                productoEncontrado = await this._productoService.buscarUno(id);
            }
            catch (error) {
                console.error('Error del servidor');
                return res.redirect('/producto/vista/inicio?mensaje=Error buscando producto');
            }
            const esAdministrador = session.roles.some((rol) => rol == 'administrador');
            const esProductor = session.roles.some((rol) => rol == 'productor');
            const esCliente = session.roles.some((rol) => rol == 'cliente');
            if (productoEncontrado) {
                return res.render('producto/crear', {
                    error: parametrosConsulta.error,
                    producto: productoEncontrado,
                    id: session.usuarioId,
                    esAdministrador: esAdministrador,
                    esProductor: esProductor,
                    esCliente: esCliente,
                });
            }
            else {
                return res.redirect('/producto/vista/inicio?mensaje=Producto no encontrado');
            }
        }
        else {
            return res.redirect('/login');
        }
    }
    async editarDesdeVista(parametrosRuta, paramBody, res, session) {
        if (session.usuarioId) {
            const productoValidado = new producto_update_dto_1.ProductoUpdateDto();
            productoValidado.id = Number(parametrosRuta.idProducto);
            productoValidado.nombre = paramBody.nombre;
            const errores = await class_validator_1.validate(productoValidado);
            if (errores.length > 0) {
                console.error('Errores:', errores);
                return res.redirect('/producto/vista/inicio?mensaje= Error en el formato de los datos');
            }
            else {
                let error;
                const re = /^[\p{L}'][ \p{L}'-]*[\p{L}]$/u;
                if (re.test(paramBody.nombre)) {
                    const usuarioEditado = {
                        productoId: Number(parametrosRuta.idProducto),
                        nombre: paramBody.nombre
                    };
                    try {
                        await this._productoService.editarUno(usuarioEditado);
                        return res.redirect('/producto/vista/inicio?mensaje= Producto editado correctamente');
                    }
                    catch (e) {
                        console.error(e);
                        error = 'Error editando Producto';
                        return res.redirect('/producto/vista/inicio?mensaje=' + error);
                    }
                }
                else {
                    error = 'Caracteres no permitidos en el nombre';
                    return res.redirect('/producto/vista/crear?error=' + error);
                }
            }
        }
        else {
            return res.redirect('/login');
        }
    }
};
__decorate([
    common_1.Get('vista/inicio'),
    __param(0, common_1.Res()),
    __param(1, common_1.Query()),
    __param(2, common_1.Session()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], ProductoController.prototype, "obtenerProductos", null);
__decorate([
    common_1.Get('vista/crear'),
    __param(0, common_1.Query()),
    __param(1, common_1.Res()),
    __param(2, common_1.Session()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", void 0)
], ProductoController.prototype, "crearProductoVista", null);
__decorate([
    common_1.Post('crearDesdeVista'),
    __param(0, common_1.Body()),
    __param(1, common_1.Res()),
    __param(2, common_1.Session()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], ProductoController.prototype, "crearDesdeVista", null);
__decorate([
    common_1.Get('vista/editar/:idProducto'),
    __param(0, common_1.Query()),
    __param(1, common_1.Res()),
    __param(2, common_1.Param()),
    __param(3, common_1.Session()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], ProductoController.prototype, "editarProductoVista", null);
__decorate([
    common_1.Post('editarDesdeVista/:idProducto'),
    __param(0, common_1.Param()),
    __param(1, common_1.Body()),
    __param(2, common_1.Res()),
    __param(3, common_1.Session()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], ProductoController.prototype, "editarDesdeVista", null);
ProductoController = __decorate([
    common_1.Controller('producto'),
    __metadata("design:paramtypes", [producto_service_1.ProductoService])
], ProductoController);
exports.ProductoController = ProductoController;
//# sourceMappingURL=producto.controller.js.map
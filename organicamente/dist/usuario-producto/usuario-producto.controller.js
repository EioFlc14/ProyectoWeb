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
exports.UsuarioProductoController = void 0;
const common_1 = require("@nestjs/common");
const class_validator_1 = require("class-validator");
const usuario_producto_service_1 = require("./usuario-producto.service");
const usuario_producto_create_dto_1 = require("./dto/usuario-producto.create-dto");
const usuario_producto_update_dto_1 = require("./dto/usuario-producto.update-dto");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const file_uploading_utils_1 = require("../utils/file-uploading.utils");
const producto_service_1 = require("../producto/producto.service");
const unidad_service_1 = require("../unidad/unidad.service");
const fs = require('fs');
let UsuarioProductoController = class UsuarioProductoController {
    constructor(_usuarioProductoService, _productoService, _unidadService) {
        this._usuarioProductoService = _usuarioProductoService;
        this._productoService = _productoService;
        this._unidadService = _unidadService;
    }
    async obtenerUsuarioProductos(parametrosRuta, parametrosConsulta, res, session) {
        if (session.usuarioId) {
            let resultadoEncontrado = [];
            try {
                if (parametrosConsulta.busqueda == undefined) {
                    parametrosConsulta.busqueda = '';
                }
                if (parametrosRuta.rol === 'cliente' || parametrosRuta.rol === 'admin') {
                    resultadoEncontrado = await this._usuarioProductoService.busquedaProductoCamposClienteAdmin(parametrosConsulta.busqueda);
                }
                else if (parametrosRuta.rol === 'productor') {
                    const id = session.usuarioId;
                    resultadoEncontrado = await this._usuarioProductoService.busquedaProductoCamposProductor(parametrosConsulta.busqueda, id);
                }
                const esAdministrador = session.roles.some((rol) => rol == 'administrador');
                const esProductor = session.roles.some((rol) => rol == 'productor');
                const esCliente = session.roles.some((rol) => rol == 'cliente');
                return res.render('usuario-producto/inicio', {
                    arregloUsuarioProductos: resultadoEncontrado,
                    rol: parametrosRuta.rol,
                    id: session.usuarioId,
                    esAdministrador: esAdministrador,
                    esProductor: esProductor,
                    esCliente: esCliente,
                });
            }
            catch (error) {
                console.error(error);
                const esAdministrador = session.roles.some((rol) => rol == 'administrador');
                const esProductor = session.roles.some((rol) => rol == 'productor');
                const esCliente = session.roles.some((rol) => rol == 'cliente');
                return res.render('usuario-producto/inicio', {
                    arregloUsuarioProductos: resultadoEncontrado,
                    rol: parametrosRuta.rol,
                    id: session.usuarioId,
                    esAdministrador: esAdministrador,
                    esProductor: esProductor,
                    esCliente: esCliente,
                });
            }
        }
        else {
            return res.redirect('/login');
        }
    }
    async crearUsuarioProductoVista(parametrosConsulta, res, session) {
        if (session.usuarioId) {
            let arregloProductos;
            let arregloUnidades;
            try {
                arregloProductos = await this._productoService.buscarTodos();
                arregloUnidades = await this._unidadService.buscarTodos();
            }
            catch (e) {
                const error = 'Error obteniendo datos.';
                return res.redirect('/principal?error=' + error);
            }
            if (arregloUnidades && arregloProductos) {
                const esAdministrador = session.roles.some((rol) => rol == 'administrador');
                const esProductor = session.roles.some((rol) => rol == 'productor');
                const esCliente = session.roles.some((rol) => rol == 'cliente');
                return res.render('usuario-producto/crear', {
                    error: parametrosConsulta.error,
                    producto: parametrosConsulta.producto,
                    stock: parametrosConsulta.stock,
                    imagen: parametrosConsulta.imagen,
                    precio: parametrosConsulta.precio,
                    usuario: parametrosConsulta.usuario,
                    unidad: parametrosConsulta.unidad,
                    arregloUnidades: arregloUnidades,
                    arregloProductos: arregloProductos,
                    id: session.usuarioId,
                    esAdministrador: esAdministrador,
                    esProductor: esProductor,
                    esCliente: esCliente,
                });
            }
            else {
                const error = 'No hay suficientes datos para esta acción. Inténtelo más tarde.';
                return res.redirect('/principal?error=' + error);
            }
        }
        else {
            return res.redirect('/login');
        }
    }
    async crearDesdeVista(paramBody, res, req, file, session) {
        if (session.usuarioId) {
            if (req.fileValidationError) {
                return res.redirect('/usuario-producto/vista/crear?error=' + req.fileValidationError);
            }
            let respuestaCreacionUsuario;
            const usuarioProductoValidado = new usuario_producto_create_dto_1.UsuarioProductoCreateDto();
            usuarioProductoValidado.productoProductoId = paramBody.producto;
            usuarioProductoValidado.stock = paramBody.stock;
            usuarioProductoValidado.precio = paramBody.precio;
            if (file == undefined) {
                usuarioProductoValidado.imagen = file_uploading_utils_1.defaultImagen;
            }
            else {
                usuarioProductoValidado.imagen = file.path.split('/')[2];
            }
            usuarioProductoValidado.unidadUnidadId = paramBody.unidad;
            const errores = await class_validator_1.validate(usuarioProductoValidado);
            const texto = `&producto=${paramBody.producto}&stock=${paramBody.stock}&precio=${paramBody.precio}&imagen=${paramBody.imagen}&unidad=${paramBody.unidad}&usuario=${paramBody.usuario}`;
            if (errores.length > 0) {
                console.log(errores);
                const error = 'Error en el formato de los datos';
                return res.redirect('/usuario-producto/vista/crear?error=' + error + texto);
            }
            else {
                try {
                    paramBody.stock = Number(paramBody.stock);
                    paramBody.precio = Number(paramBody.precio);
                    paramBody.producto = Number(paramBody.producto);
                    paramBody.unidad = Number(paramBody.unidad);
                    paramBody.usuario = session.usuarioId;
                    if (paramBody.precio > 0) {
                        if (file == undefined) {
                            paramBody.imagen = file_uploading_utils_1.defaultImagen;
                        }
                        else {
                            paramBody.imagen = file.path.split('/')[2];
                        }
                        let usuarioProducto = paramBody;
                        usuarioProducto = JSON.parse(JSON.stringify(usuarioProducto));
                        respuestaCreacionUsuario = await this._usuarioProductoService.crearUno(usuarioProducto);
                    }
                    else {
                        const errorCreacion = 'El precio debe ser mayor a 0.';
                        return res.redirect('/usuario-producto/vista/crear?error=' + errorCreacion + texto);
                    }
                }
                catch (e) {
                    console.error(e);
                    const errorCreacion = 'Error al crear el producto.';
                    return res.redirect('/usuario-producto/vista/crear?error=' + errorCreacion + texto);
                }
                if (respuestaCreacionUsuario) {
                    return res.redirect('/usuario-producto/vista/inicio/productor');
                }
                else {
                    const errorCreacion = 'Error al crear el producto';
                    return res.redirect('/usuario-producto/vista/crear?error=' + errorCreacion + texto);
                }
            }
        }
        else {
            return res.redirect('/login');
        }
    }
    async editarUsuarioProductoVista(parametrosConsulta, res, parametrosRuta, session) {
        if (session.usuarioId) {
            const id = Number(parametrosRuta.idUsuarioProducto);
            let usuarioProductoEncontrado;
            let arregloUnidades;
            try {
                usuarioProductoEncontrado = await this._usuarioProductoService.buscarUno(id);
                arregloUnidades = await this._unidadService.buscarTodos();
            }
            catch (error) {
                console.error('Error del servidor');
                return res.redirect('/usuario-producto/vista/inicio?mensaje=Error obteniendo datos');
            }
            if (usuarioProductoEncontrado) {
                const esAdministrador = session.roles.some((rol) => rol == 'administrador');
                const esProductor = session.roles.some((rol) => rol == 'productor');
                const esCliente = session.roles.some((rol) => rol == 'cliente');
                return res.render('usuario-producto/crear', {
                    error: parametrosConsulta.error,
                    usuarioProducto: usuarioProductoEncontrado,
                    arregloUnidades: arregloUnidades,
                    id: session.usuarioId,
                    esAdministrador: esAdministrador,
                    esProductor: esProductor,
                    esCliente: esCliente,
                });
            }
            else {
                return res.redirect('/usuario-producto/vista/inicio?mensaje=Usuario Producto no encontrado');
            }
        }
        else {
            return res.redirect('/login');
        }
    }
    async editarDesdeVista(parametrosRuta, paramBody, res, file, session) {
        if (session.usuarioId) {
            const usuarioProductoValidado = new usuario_producto_update_dto_1.UsuarioProductoUpdateDto();
            usuarioProductoValidado.id = Number(parametrosRuta.id);
            usuarioProductoValidado.stock = paramBody.stock;
            usuarioProductoValidado.precio = paramBody.precio;
            if (file == undefined) {
                usuarioProductoValidado.imagen = file_uploading_utils_1.defaultImagen;
            }
            else {
                usuarioProductoValidado.imagen = file.path.split('/')[2];
            }
            const errores = await class_validator_1.validate(usuarioProductoValidado);
            if (errores.length > 0) {
                return res.redirect('/principal?error= Error al editar el producto.');
            }
            else {
                if (file == undefined) {
                    paramBody.imagen = file_uploading_utils_1.defaultImagen;
                }
                else {
                    paramBody.imagen = file.path.split('/')[2];
                }
                const usuarioProducto = {
                    usuarioProductoId: Number(parametrosRuta.id),
                    stock: Number(paramBody.stock),
                    precio: Number(paramBody.precio),
                    imagen: paramBody.imagen,
                };
                try {
                    await this._usuarioProductoService.editarUno(usuarioProducto);
                    return res.redirect('/principal?exito= Producto editado correctamente');
                }
                catch (e) {
                    console.error(e);
                    const errorCreacion = 'Error al editar el producto.';
                    return res.redirect('/principal?error=' + errorCreacion);
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
    __param(0, common_1.Param()),
    __param(1, common_1.Query()),
    __param(2, common_1.Res()),
    __param(3, common_1.Session()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], UsuarioProductoController.prototype, "obtenerUsuarioProductos", null);
__decorate([
    common_1.Get('vista/crear'),
    __param(0, common_1.Query()),
    __param(1, common_1.Res()),
    __param(2, common_1.Session()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], UsuarioProductoController.prototype, "crearUsuarioProductoVista", null);
__decorate([
    common_1.Post('crearDesdeVista'),
    common_1.UseInterceptors(platform_express_1.FileInterceptor('imagen', {
        storage: multer_1.diskStorage({
            destination: 'publico/imagenes',
            filename: file_uploading_utils_1.editFileName,
        }),
        fileFilter: file_uploading_utils_1.imageFileFilter
    })),
    __param(0, common_1.Body()),
    __param(1, common_1.Res()),
    __param(2, common_1.Req()),
    __param(3, common_1.UploadedFile()),
    __param(4, common_1.Session()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], UsuarioProductoController.prototype, "crearDesdeVista", null);
__decorate([
    common_1.Get('vista/editar/:idUsuarioProducto'),
    __param(0, common_1.Query()),
    __param(1, common_1.Res()),
    __param(2, common_1.Param()),
    __param(3, common_1.Session()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], UsuarioProductoController.prototype, "editarUsuarioProductoVista", null);
__decorate([
    common_1.Post('editarDesdeVista/:id'),
    common_1.UseInterceptors(platform_express_1.FileInterceptor('imagen', {
        storage: multer_1.diskStorage({
            destination: 'publico/imagenes',
            filename: file_uploading_utils_1.editFileName,
        }),
        fileFilter: file_uploading_utils_1.imageFileFilter
    })),
    __param(0, common_1.Param()),
    __param(1, common_1.Body()),
    __param(2, common_1.Res()),
    __param(3, common_1.UploadedFile()),
    __param(4, common_1.Session()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], UsuarioProductoController.prototype, "editarDesdeVista", null);
UsuarioProductoController = __decorate([
    common_1.Controller('usuario-producto'),
    __metadata("design:paramtypes", [usuario_producto_service_1.UsuarioProductoService,
        producto_service_1.ProductoService,
        unidad_service_1.UnidadService])
], UsuarioProductoController);
exports.UsuarioProductoController = UsuarioProductoController;
//# sourceMappingURL=usuario-producto.controller.js.map
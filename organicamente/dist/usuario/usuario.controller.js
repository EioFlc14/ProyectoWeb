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
exports.UsuarioController = void 0;
const common_1 = require("@nestjs/common");
const usuario_service_1 = require("./usuario.service");
const usuario_create_dto_1 = require("./dto/usuario.create-dto");
const class_validator_1 = require("class-validator");
const usuario_update_dto_1 = require("./dto/usuario.update-dto");
const rol_service_1 = require("../rol/rol.service");
const usuario_rol_service_1 = require("../usuario-rol/usuario-rol.service");
const contrasena_update_dto_1 = require("./dto/contrasena.update-dto");
let UsuarioController = class UsuarioController {
    constructor(_usuarioService, _rolService, _usuarioRolService) {
        this._usuarioService = _usuarioService;
        this._rolService = _rolService;
        this._usuarioRolService = _usuarioRolService;
    }
    async obtenerUsuarios(res, parametrosConsulta, session) {
        if (session.usuarioId) {
            let resultadoEncontrado;
            let error;
            try {
                if (parametrosConsulta.busqueda == undefined) {
                    parametrosConsulta.busqueda = '';
                }
                resultadoEncontrado = await this._usuarioService.buscarTodos(parametrosConsulta.busqueda);
            }
            catch (error) {
                error = 'Error encontrando usuarios.';
                return res.redirect('/principal?error=' + error);
            }
            const esAdministrador = session.roles.some((rol) => rol == 'administrador');
            const esProductor = session.roles.some((rol) => rol == 'productor');
            const esCliente = session.roles.some((rol) => rol == 'cliente');
            if (resultadoEncontrado) {
                return res.render('usuario/inicio', {
                    arregloUsuarios: resultadoEncontrado,
                    id: session.usuarioId,
                    esAdministrador: esAdministrador,
                    esProductor: esProductor,
                    esCliente: esCliente,
                });
            }
            else {
                error = 'No se encontraron usuarios para mostrar.';
                return res.redirect('/principal?error=' + error);
            }
        }
        else {
            return res.redirect('/login');
        }
    }
    crearUsuarioVista(parametrosConsulta, res, session) {
        if (session.usuarioId) {
            const esAdministrador = session.roles.some((rol) => rol == 'administrador');
            const esProductor = session.roles.some((rol) => rol == 'productor');
            const esCliente = session.roles.some((rol) => rol == 'cliente');
            return res.render('usuario/crear', {
                error: parametrosConsulta.error,
                nombre: parametrosConsulta.nombre,
                apellido: parametrosConsulta.apellido,
                email: parametrosConsulta.email,
                telefono: parametrosConsulta.telefono,
                direccion: parametrosConsulta.direccion,
                username: parametrosConsulta.username,
                password: parametrosConsulta.password,
                identificacion: parametrosConsulta.identificacion,
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
            const usuarioValidado = new usuario_create_dto_1.UsuarioCreateDto();
            usuarioValidado.nombre = paramBody.nombre;
            usuarioValidado.apellido = paramBody.apellido;
            usuarioValidado.email = paramBody.email;
            usuarioValidado.telefono = paramBody.telefono;
            usuarioValidado.direccion = paramBody.direccion;
            usuarioValidado.username = paramBody.username;
            usuarioValidado.password = paramBody.password;
            usuarioValidado.identificacion = paramBody.identificacion;
            const errores = await class_validator_1.validate(usuarioValidado);
            const texto = `&nombre=${paramBody.nombre}&apellido=${paramBody.apellido}&email=${paramBody.email}&telefono=${paramBody.telefono}&direccion=${paramBody.direccion}&username=${paramBody.username}&identificacion=${paramBody.identificacion}`;
            if (errores.length > 0) {
                const error = 'Error en el formato de los datos. Asegúrese de llenar los campos correctamente.';
                return res.redirect('/usuario/vista/crear?error=' + error + texto);
            }
            else {
                const re = /^[\p{L}'][ \p{L}'-]*[\p{L}]$/u;
                if (re.test(paramBody.nombre)) {
                    let respuestaCreacionUsuario;
                    if (paramBody.password === paramBody.passwordConfirmada) {
                        if (paramBody.productor != undefined || paramBody.cliente != undefined || paramBody.administrador != undefined) {
                            const emailExistente = await this._usuarioService.emailRegistrado(paramBody.email);
                            if (emailExistente.length > 0) {
                                const errorCreacion = 'Correo ya registrado. Ingrese otro.';
                                return res.redirect('/usuario/vista/crear?error=' + errorCreacion + texto);
                            }
                            else {
                                const usernameExistente = await this._usuarioService.usernameRegistrado(paramBody.username);
                                if (usernameExistente.length > 0) {
                                    const errorCreacion = 'Nombre de usuario ya registrado. Ingrese otro.';
                                    return res.redirect('/usuario/vista/crear?error=' + errorCreacion + texto);
                                }
                                else {
                                    try {
                                        respuestaCreacionUsuario = await this._usuarioService.crearUno(paramBody);
                                    }
                                    catch (e) {
                                        console.error(e);
                                        const errorCreacion = 'Error al crear el Usuario. Inténtelo más tarde.';
                                        return res.redirect('/principal?error=' + errorCreacion);
                                    }
                                    let respuestaRoles;
                                    if (respuestaCreacionUsuario) {
                                        let productorRol = true;
                                        let clienteRol = true;
                                        let administradorRol = true;
                                        if (paramBody.productor != undefined) {
                                            productorRol = false;
                                            let respuestaCreacionUsuarioRolProductor;
                                            respuestaRoles = await this._rolService.buscarUnoNombre(paramBody.productor);
                                            const usuarioRol = {
                                                usuario: respuestaCreacionUsuario.usuarioId,
                                                rol: respuestaRoles.rolId
                                            };
                                            respuestaCreacionUsuarioRolProductor = await this._usuarioRolService.crearUno(usuarioRol);
                                            if (respuestaCreacionUsuarioRolProductor) {
                                                productorRol = true;
                                            }
                                            else {
                                                const errorCreacion = 'Error al crear el Usuario';
                                                return res.redirect('/principal?error=' + errorCreacion);
                                            }
                                        }
                                        if (paramBody.cliente != undefined) {
                                            clienteRol = false;
                                            let respuestaCreacionUsuarioRolCliente;
                                            respuestaRoles = await this._rolService.buscarUnoNombre(paramBody.cliente);
                                            const usuarioRol = {
                                                usuario: respuestaCreacionUsuario.usuarioId,
                                                rol: respuestaRoles.rolId
                                            };
                                            respuestaCreacionUsuarioRolCliente = await this._usuarioRolService.crearUno(usuarioRol);
                                            if (respuestaCreacionUsuarioRolCliente) {
                                                clienteRol = true;
                                            }
                                            else {
                                                const errorCreacion = 'Error al crear el Usuario';
                                                return res.redirect('/principal?error=' + errorCreacion);
                                            }
                                        }
                                        if (paramBody.administrador != undefined) {
                                            administradorRol = false;
                                            let respuestaCreacionUsuarioRolAdministrador;
                                            respuestaRoles = await this._rolService.buscarUnoNombre(paramBody.administrador);
                                            const usuarioRol = {
                                                usuario: respuestaCreacionUsuario.usuarioId,
                                                rol: respuestaRoles.rolId
                                            };
                                            respuestaCreacionUsuarioRolAdministrador = await this._usuarioRolService.crearUno(usuarioRol);
                                            if (respuestaCreacionUsuarioRolAdministrador) {
                                                administradorRol = true;
                                            }
                                            else {
                                                const errorCreacion = 'Error al crear el Usuario';
                                                return res.redirect('/principal?error=' + errorCreacion);
                                            }
                                        }
                                        if (clienteRol && productorRol && administradorRol) {
                                            const exito = 'Usuario creado correctamente';
                                            return res.redirect('/principal?exito=' + exito);
                                        }
                                        else {
                                            const errorCreacion = 'Error al crear el Usuario.';
                                            return res.redirect('/principal?error=' + errorCreacion);
                                        }
                                    }
                                    else {
                                        const errorCreacion = 'Error al crear el Usuario';
                                        return res.redirect('/principal?error=' + errorCreacion);
                                    }
                                }
                            }
                        }
                        else {
                            const errorCreacion = 'Debe seleccionar al menos un Rol.';
                            return res.redirect('/usuario/vista/crear?error=' + errorCreacion + texto);
                        }
                    }
                    else {
                        const errorCreacion = 'Las contraseñas no coinciden. Deben ser las mismas.';
                        return res.redirect('/usuario/vista/crear?error=' + errorCreacion + texto);
                    }
                }
                else {
                    const error = 'Caracteres no permitidos.';
                    return res.redirect('/usuario/vista/crear?error=' + error);
                }
            }
        }
        else {
            return res.redirect('/login');
        }
    }
    async editarUsuarioVista(parametrosConsulta, parametrosRuta, res, session) {
        if (session.usuarioId) {
            const id = Number(parametrosRuta.id);
            let usuarioEncontrado;
            try {
                usuarioEncontrado = await this._usuarioService.buscarUno(id);
                if (usuarioEncontrado) {
                    let rolesEncontrados;
                    let cliente;
                    let productor;
                    let administrador;
                    rolesEncontrados = await this._usuarioRolService.buscarRolesUnUsuario(usuarioEncontrado.usuarioId);
                    rolesEncontrados.forEach((objeto) => {
                        if (objeto.rol.toLowerCase() === 'cliente') {
                            cliente = 'Cliente';
                        }
                        if (objeto.rol.toLowerCase() === 'productor') {
                            productor = 'Productor';
                        }
                        if (objeto.rol.toLowerCase() === 'administrador') {
                            administrador = 'Administrador';
                        }
                    });
                    const esAdministrador = session.roles.some((rol) => rol == 'administrador');
                    const esProductor = session.roles.some((rol) => rol == 'productor');
                    const esCliente = session.roles.some((rol) => rol == 'cliente');
                    return res.render('usuario/crear', {
                        error: parametrosConsulta.error,
                        usuario: usuarioEncontrado,
                        cliente: cliente,
                        productor: productor,
                        administrador: administrador,
                        id: session.usuarioId,
                        esAdministrador: esAdministrador,
                        esProductor: esProductor,
                        esCliente: esCliente,
                    });
                }
                else {
                    return res.redirect('/usuario/vista/inicio?error=Usuario no encontrado');
                }
            }
            catch (error) {
                console.error('Error del servidor');
                return res.redirect('/usuario/vista/inicio?error=Error buscando usuario.....');
            }
        }
        else {
            return res.redirect('/login');
        }
    }
    async editarUsuarioVistaMiCuenta(parametrosConsulta, parametrosRuta, res, session) {
        if (session.usuarioId) {
            const id = session.usuarioId;
            let usuarioEncontrado;
            try {
                usuarioEncontrado = await this._usuarioService.buscarUno(id);
                if (usuarioEncontrado) {
                    let rolesEncontrados;
                    let cliente;
                    let productor;
                    let administrador;
                    rolesEncontrados = await this._usuarioRolService.buscarRolesUnUsuario(usuarioEncontrado.usuarioId);
                    rolesEncontrados.forEach((objeto) => {
                        if (objeto.rol.toLowerCase() === 'cliente') {
                            cliente = 'Cliente';
                        }
                        if (objeto.rol.toLowerCase() === 'productor') {
                            productor = 'Productor';
                        }
                        if (objeto.rol.toLowerCase() === 'administrador') {
                            administrador = 'Administrador';
                        }
                    });
                    const esAdministrador = session.roles.some((rol) => rol == 'administrador');
                    const esProductor = session.roles.some((rol) => rol == 'productor');
                    const esCliente = session.roles.some((rol) => rol == 'cliente');
                    return res.render('usuario/crear', {
                        error: parametrosConsulta.error,
                        usuario: usuarioEncontrado,
                        cliente: cliente,
                        productor: productor,
                        administrador: administrador,
                        id: session.usuarioId,
                        esAdministrador: esAdministrador,
                        esProductor: esProductor,
                        esCliente: esCliente,
                    });
                }
                else {
                    return res.redirect('/usuario/vista/inicio?error=Usuario no encontrado');
                }
            }
            catch (error) {
                console.error('Error del servidor');
                return res.redirect('/usuario/vista/inicio?error=Error buscando usuario.....');
            }
        }
        else {
            return res.redirect('/login');
        }
    }
    async editarDesdeVista(parametrosRuta, paramBody, res, session) {
        if (session.usuarioId) {
            const id = Number(parametrosRuta.id);
            const usuarioValidado = new usuario_update_dto_1.UsuarioUpdateDto();
            usuarioValidado.id = id;
            usuarioValidado.nombre = paramBody.nombre;
            usuarioValidado.apellido = paramBody.apellido;
            usuarioValidado.telefono = paramBody.telefono;
            usuarioValidado.direccion = paramBody.direccion;
            const errores = await class_validator_1.validate(usuarioValidado);
            if (errores.length > 0) {
                return res.redirect('/usuario/vista/editar/' + parametrosRuta.id + '?error=Error en el formato de los datos');
            }
            else {
                const re = /^[\p{L}'][ \p{L}'-]*[\p{L}]$/u;
                if (re.test(paramBody.nombre)) {
                    if (paramBody.productor != undefined || paramBody.cliente != undefined || paramBody.administrador != undefined) {
                        const eliminacionRoles = await this._usuarioRolService.eliminarUno(id);
                        if (eliminacionRoles) {
                            const usuarioEditado = {
                                usuarioId: id,
                                nombre: paramBody.nombre,
                                apellido: paramBody.apellido,
                                telefono: paramBody.telefono,
                                direccion: paramBody.direccion,
                            };
                            try {
                                const respuestaUsuarioEditado = await this._usuarioService.editarUno(usuarioEditado);
                                if (respuestaUsuarioEditado) {
                                    let respuestaRoles;
                                    let productorRol = true;
                                    let clienteRol = true;
                                    let administradorRol = true;
                                    if (paramBody.productor != undefined) {
                                        productorRol = false;
                                        respuestaRoles = await this._rolService.buscarUnoNombre(paramBody.productor);
                                        const usuarioRol = {
                                            usuario: id,
                                            rol: respuestaRoles.rolId
                                        };
                                        const respuestaCreacionUsuarioRolProductor = await this._usuarioRolService.crearUno(usuarioRol);
                                        if (respuestaCreacionUsuarioRolProductor) {
                                            productorRol = true;
                                        }
                                        else {
                                            const errorCreacion = 'Error al editar el Usuario';
                                            return res.redirect('/principal?error=' + errorCreacion);
                                        }
                                    }
                                    if (paramBody.cliente != undefined) {
                                        clienteRol = false;
                                        let respuestaCreacionUsuarioRolCliente;
                                        respuestaRoles = await this._rolService.buscarUnoNombre(paramBody.cliente);
                                        const usuarioRol = {
                                            usuario: id,
                                            rol: respuestaRoles.rolId
                                        };
                                        respuestaCreacionUsuarioRolCliente = await this._usuarioRolService.crearUno(usuarioRol);
                                        if (respuestaCreacionUsuarioRolCliente) {
                                            clienteRol = true;
                                        }
                                        else {
                                            const errorCreacion = 'Error al editar el Usuario';
                                            return res.redirect('/principal?error=' + errorCreacion);
                                        }
                                    }
                                    if (paramBody.administrador != undefined) {
                                        administradorRol = false;
                                        let respuestaCreacionUsuarioRolAdministrador;
                                        respuestaRoles = await this._rolService.buscarUnoNombre(paramBody.administrador);
                                        const usuarioRol = {
                                            usuario: id,
                                            rol: respuestaRoles.rolId
                                        };
                                        respuestaCreacionUsuarioRolAdministrador = await this._usuarioRolService.crearUno(usuarioRol);
                                        if (respuestaCreacionUsuarioRolAdministrador) {
                                            administradorRol = true;
                                        }
                                        else {
                                            const errorCreacion = 'Error al editar el Usuario';
                                            return res.redirect('/principal?error=' + errorCreacion);
                                        }
                                    }
                                    if (clienteRol && productorRol && administradorRol) {
                                        const exito = 'Usuario editado correctamente';
                                        return res.redirect('/principal?exito=' + exito);
                                    }
                                    else {
                                        const errorCreacion = 'Error al editar el Usuario.';
                                        return res.redirect('/principal?error=' + errorCreacion);
                                    }
                                }
                                else {
                                    const errorCreacion = 'Error editando Usuario';
                                    return res.redirect('/principal?error=' + errorCreacion);
                                }
                            }
                            catch (e) {
                                console.error(e);
                                const errorCreacion = 'Error editando Usuario';
                                return res.redirect('/principal?error=' + errorCreacion);
                            }
                        }
                    }
                    else {
                        const errorCreacion = 'Debe seleccionar al menos un Rol.';
                        return res.redirect('/usuario/vista/editar/' + id + '?error=' + errorCreacion);
                    }
                }
                else {
                    const error = 'Caracteres no permitidos en el nombre';
                    return res.redirect('/usuario/vista/editar/' + id + '?error=' + error);
                }
            }
        }
        else {
            return res.redirect('/login');
        }
    }
    cambiarContrasena(parametrosConsulta, res, parametrosRuta, session) {
        if (session.usuarioId) {
            const esAdministrador = session.roles.some((rol) => rol == 'administrador');
            const esProductor = session.roles.some((rol) => rol == 'productor');
            const esCliente = session.roles.some((rol) => rol == 'cliente');
            return res.render('usuario/contrasena', {
                error: parametrosConsulta.error,
                usuarioId: parametrosRuta.id,
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
    cambiarContrasenaMiCuenta(parametrosConsulta, res, session) {
        if (session.usuarioId) {
            const esAdministrador = session.roles.some((rol) => rol == 'administrador');
            const esProductor = session.roles.some((rol) => rol == 'productor');
            const esCliente = session.roles.some((rol) => rol == 'cliente');
            return res.render('usuario/contrasena', {
                error: parametrosConsulta.error,
                usuarioId: session.usuarioId,
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
    async cambiarContrasenaDesdeVista(paramBody, res, parametrosRuta, session) {
        if (session.usuarioId) {
            const id = Number(parametrosRuta.id);
            const contrasenaValidada = new contrasena_update_dto_1.ContrasenaUpdateDto();
            contrasenaValidada.actual = paramBody.actual;
            contrasenaValidada.nueva = paramBody.nueva;
            contrasenaValidada.confirmacionNueva = paramBody.confirmacionNueva;
            const errores = await class_validator_1.validate(contrasenaValidada);
            let error = 'Error en el formato de los datos';
            if (errores.length > 0) {
                return res.redirect('/usuario/vista/cambiarContrasena/' + id + '?error=' + error);
            }
            else {
                if (paramBody.nueva === paramBody.confirmacionNueva) {
                    const viejaContrasena = await this._usuarioService.buscarUno(id);
                    if (viejaContrasena.password === paramBody.actual) {
                        const contrasenaNueva = {
                            usuarioId: id,
                            password: paramBody.nueva,
                        };
                        const contrasenaActualizada = await this._usuarioService.editarUno(contrasenaNueva);
                        if (contrasenaActualizada) {
                            const exito = 'Contraseña actualizada exitosamente.';
                            return res.redirect('/principal?exito=' + exito);
                        }
                        else {
                            error = 'Error al cambiar la contraseña.';
                            return res.redirect('/principal?error=' + error);
                        }
                    }
                    else {
                        error = 'Su contraseña actual no es la correcta. Ingrese nuevamente.';
                        return res.redirect('/usuario/vista/cambiarContrasena/' + id + '?error=' + error);
                    }
                }
                else {
                    error = 'No coinciden las contraseñas nuevas. Ingrese nuevamente';
                    return res.redirect('/usuario/vista/cambiarContrasena/' + id + '?error=' + error);
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
], UsuarioController.prototype, "obtenerUsuarios", null);
__decorate([
    common_1.Get('vista/crear'),
    __param(0, common_1.Query()),
    __param(1, common_1.Res()),
    __param(2, common_1.Session()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", void 0)
], UsuarioController.prototype, "crearUsuarioVista", null);
__decorate([
    common_1.Post('crearDesdeVista'),
    __param(0, common_1.Body()),
    __param(1, common_1.Res()),
    __param(2, common_1.Session()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], UsuarioController.prototype, "crearDesdeVista", null);
__decorate([
    common_1.Get('vista/editar/:id'),
    __param(0, common_1.Query()),
    __param(1, common_1.Param()),
    __param(2, common_1.Res()),
    __param(3, common_1.Session()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], UsuarioController.prototype, "editarUsuarioVista", null);
__decorate([
    common_1.Get('vista/editar'),
    __param(0, common_1.Query()),
    __param(1, common_1.Param()),
    __param(2, common_1.Res()),
    __param(3, common_1.Session()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], UsuarioController.prototype, "editarUsuarioVistaMiCuenta", null);
__decorate([
    common_1.Post('editarDesdeVista/:id'),
    __param(0, common_1.Param()),
    __param(1, common_1.Body()),
    __param(2, common_1.Res()),
    __param(3, common_1.Session()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], UsuarioController.prototype, "editarDesdeVista", null);
__decorate([
    common_1.Get('vista/cambiarContrasena/:id'),
    __param(0, common_1.Query()),
    __param(1, common_1.Res()),
    __param(2, common_1.Param()),
    __param(3, common_1.Session()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object]),
    __metadata("design:returntype", void 0)
], UsuarioController.prototype, "cambiarContrasena", null);
__decorate([
    common_1.Get('vista/cambiarContrasena'),
    __param(0, common_1.Query()),
    __param(1, common_1.Res()),
    __param(2, common_1.Session()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", void 0)
], UsuarioController.prototype, "cambiarContrasenaMiCuenta", null);
__decorate([
    common_1.Post('cambiarContrasenaDesdeVista/:id'),
    __param(0, common_1.Body()),
    __param(1, common_1.Res()),
    __param(2, common_1.Param()),
    __param(3, common_1.Session()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], UsuarioController.prototype, "cambiarContrasenaDesdeVista", null);
UsuarioController = __decorate([
    common_1.Controller('usuario'),
    __metadata("design:paramtypes", [usuario_service_1.UsuarioService,
        rol_service_1.RolService,
        usuario_rol_service_1.UsuarioRolService])
], UsuarioController);
exports.UsuarioController = UsuarioController;
//# sourceMappingURL=usuario.controller.js.map
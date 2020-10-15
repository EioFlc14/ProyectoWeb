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
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const app_service_1 = require("./app.service");
const usuario_create_dto_1 = require("./usuario/dto/usuario.create-dto");
const class_validator_1 = require("class-validator");
const usuario_service_1 = require("./usuario/usuario.service");
const rol_service_1 = require("./rol/rol.service");
const usuario_rol_service_1 = require("./usuario-rol/usuario-rol.service");
let AppController = class AppController {
    constructor(appService, _usuarioService, _rolService, _usuarioRolService) {
        this.appService = appService;
        this._usuarioService = _usuarioService;
        this._rolService = _rolService;
        this._usuarioRolService = _usuarioRolService;
    }
    login(paramConsulta, res, session) {
        if (session.usuarioId) {
            return res.redirect('/principal?exito=Usted ya tiene una sesión activa.');
        }
        else {
            return res.render('login', {
                error: paramConsulta.error,
                exito: paramConsulta.exito,
            });
        }
    }
    principal(paramConsulta, res, session) {
        if (session.usuarioId) {
            const esAdministrador = session.roles.some((rol) => rol == 'administrador');
            const esProductor = session.roles.some((rol) => rol == 'productor');
            const esCliente = session.roles.some((rol) => rol == 'cliente');
            return res.render('principal', {
                usuario: paramConsulta.usuario,
                exito: paramConsulta.exito,
                error: paramConsulta.error,
                id: session.usuarioId,
                esAdministrador: esAdministrador,
                esProductor: esProductor,
                esCliente: esCliente,
            });
        }
        else {
            return res.redirect('login');
        }
    }
    async loginDesdeVista(paramBody, res, session) {
        try {
            const user = paramBody.user;
            const password = paramBody.password;
            const respuestaLogeo = await this._usuarioService.validarLogin(user, password);
            if (respuestaLogeo.length == 1) {
                const usuario = respuestaLogeo[0];
                session.usuarioId = usuario.usuarioId;
                const roles = await this._usuarioRolService.buscarRolesUnUsuario(usuario.usuarioId);
                session.roles = [];
                roles.forEach((rol) => {
                    if (rol.rol.toLowerCase() == 'cliente') {
                        session.roles.push("cliente");
                    }
                    if (rol.rol.toLowerCase() == 'productor') {
                        session.roles.push("productor");
                    }
                    if (rol.rol.toLowerCase() == 'administrador') {
                        session.roles.push("administrador");
                    }
                });
                return res.redirect('principal');
            }
            else {
                return res.redirect('login?error=Usuario no encontrado. Revise sus credenciales.');
            }
        }
        catch (error) {
            console.error('Error del servidor');
            return res.redirect('login?error=Error en el servidor.');
        }
    }
    registro(parametrosConsulta, res) {
        return res.render('registro', {
            error: parametrosConsulta.error,
            nombre: parametrosConsulta.nombre,
            apellido: parametrosConsulta.apellido,
            email: parametrosConsulta.email,
            telefono: parametrosConsulta.telefono,
            direccion: parametrosConsulta.direccion,
            username: parametrosConsulta.username,
            identificacion: parametrosConsulta.identificacion
        });
    }
    async registroDesdeVista(paramBody, res) {
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
            const error = 'Error en el formato de los datos. Asegúrese de llenar todos los campos correctamente.';
            return res.redirect('registro?error=' + error + texto);
        }
        else {
            const re = /^[\p{L}'][ \p{L}'-]*[\p{L}]$/u;
            if (re.test(paramBody.nombre)) {
                let respuestaCreacionUsuario;
                if (paramBody.password === paramBody.confirmPassword) {
                    if (paramBody.productor != undefined || paramBody.cliente != undefined) {
                        const emailExistente = await this._usuarioService.emailRegistrado(paramBody.email);
                        if (emailExistente.length > 0) {
                            const errorCreacion = 'Correo ya registrado. Ingrese otro.';
                            return res.redirect('registro?error=' + errorCreacion + texto);
                        }
                        else {
                            const usernameExistente = await this._usuarioService.usernameRegistrado(paramBody.username);
                            if (usernameExistente.length > 0) {
                                const errorCreacion = 'Nombre de usuario ya registrado. Ingrese otro.';
                                return res.redirect('registro?error=' + errorCreacion + texto);
                            }
                            else {
                                try {
                                    respuestaCreacionUsuario = await this._usuarioService.crearUno(paramBody);
                                }
                                catch (e) {
                                    console.error(e);
                                    const errorCreacion = 'Error al crear el Usuario';
                                    return res.redirect('registro?error=' + errorCreacion + texto);
                                }
                                let respuestaRoles;
                                if (respuestaCreacionUsuario) {
                                    let productorRol = true;
                                    let clienteRol = true;
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
                                            return res.redirect('registro?error=' + errorCreacion + texto);
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
                                            return res.redirect('registro?error=' + errorCreacion + texto);
                                        }
                                    }
                                    if (clienteRol && productorRol) {
                                        const exito = 'Usuario creado correctamente';
                                        return res.redirect('login?exito=' + exito);
                                    }
                                    else {
                                        const errorCreacion = 'Error al crear el Usuario.';
                                        return res.redirect('registro?error=' + errorCreacion + texto);
                                    }
                                }
                                else {
                                    const errorCreacion = 'Error al crear el Usuario';
                                    return res.redirect('registro?error=' + errorCreacion + texto);
                                }
                            }
                        }
                    }
                    else {
                        const errorCreacion = 'Debe seleccionar al menos un Rol.';
                        return res.redirect('registro?error=' + errorCreacion + texto);
                    }
                }
                else {
                    const errorCreacion = 'Las contraseñas no coinciden. Deben ser las mismas.';
                    return res.redirect('registro?error=' + errorCreacion + texto);
                }
            }
            else {
                const error = 'Caracteres no permitidos.';
                return res.redirect('registro?error=' + error);
            }
        }
    }
    cerrarSesion(session, res, req) {
        if (session.usuarioId) {
            session.usuarioId = undefined;
            session.roles = undefined;
            req.session.destroy();
            return res.redirect('login');
        }
        else {
            return res.redirect('login');
        }
    }
};
__decorate([
    common_1.Get('login'),
    __param(0, common_1.Query()),
    __param(1, common_1.Res()),
    __param(2, common_1.Session()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "login", null);
__decorate([
    common_1.Get('principal'),
    __param(0, common_1.Query()),
    __param(1, common_1.Res()),
    __param(2, common_1.Session()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "principal", null);
__decorate([
    common_1.Post('loginDesdeVista'),
    __param(0, common_1.Body()),
    __param(1, common_1.Res()),
    __param(2, common_1.Session()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "loginDesdeVista", null);
__decorate([
    common_1.Get('registro'),
    __param(0, common_1.Query()),
    __param(1, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "registro", null);
__decorate([
    common_1.Post('registroDesdeVista'),
    __param(0, common_1.Body()),
    __param(1, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "registroDesdeVista", null);
__decorate([
    common_1.Get('cerrarSesion'),
    __param(0, common_1.Session()),
    __param(1, common_1.Res()),
    __param(2, common_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "cerrarSesion", null);
AppController = __decorate([
    common_1.Controller(),
    __metadata("design:paramtypes", [app_service_1.AppService,
        usuario_service_1.UsuarioService,
        rol_service_1.RolService,
        usuario_rol_service_1.UsuarioRolService])
], AppController);
exports.AppController = AppController;
//# sourceMappingURL=app.controller.js.map
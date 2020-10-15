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
exports.RolController = void 0;
const common_1 = require("@nestjs/common");
const class_validator_1 = require("class-validator");
const rol_service_1 = require("./rol.service");
const rol_create_dto_1 = require("./dto/rol.create-dto");
let RolController = class RolController {
    constructor(_rolService) {
        this._rolService = _rolService;
    }
    async obtenerUnidades(paramConsulta, res, session) {
        if (session.usuarioId) {
            let resultadoEncontrado;
            try {
                resultadoEncontrado = await this._rolService.buscarTodos();
            }
            catch (e) {
                const error = 'Error al obtener roles.';
                return res.redirect('/principal?error=' + error);
            }
            const esAdministrador = session.roles.some((rol) => rol == 'administrador');
            const esProductor = session.roles.some((rol) => rol == 'productor');
            const esCliente = session.roles.some((rol) => rol == 'cliente');
            if (resultadoEncontrado) {
                return res.render('rol/inicio', {
                    arregloRoles: resultadoEncontrado,
                    error: paramConsulta.error,
                    id: session.usuarioId,
                    esAdministrador: esAdministrador,
                    esProductor: esProductor,
                    esCliente: esCliente,
                });
            }
            else {
                const error = 'No hay roles para mostrar.';
                return res.redirect('/principal?error=' + error);
            }
        }
        else {
            return res.redirect('/login');
        }
    }
    async crearDesdeVista(paramBody, res, session) {
        if (session.usuarioId) {
            let respuestaCreacionRol;
            const rolCreado = new rol_create_dto_1.RolCreateDto();
            rolCreado.nombre = paramBody.nombre;
            const errores = await class_validator_1.validate(rolCreado);
            const texto = `&nombre=${paramBody.nombre}`;
            if (errores.length > 0) {
                const error = 'Error en el formato de los datos';
                return res.redirect('/rol/vista/inicio?error=' + error + texto);
            }
            else {
                let error;
                const re = /^[\p{L}'][ \p{L}'-]*[\p{L}]$/u;
                if (re.test(paramBody.nombre)) {
                    try {
                        respuestaCreacionRol = await this._rolService.crearUno(paramBody);
                    }
                    catch (e) {
                        console.error(e);
                        error = 'Error al crear el rol';
                        return res.redirect('/principal?error=' + error);
                    }
                    if (respuestaCreacionRol) {
                        const exito = 'Rol creado exitosamente.';
                        return res.redirect('/principal?exito=' + exito);
                    }
                    else {
                        error = 'Error al crear el rol';
                        return res.redirect('/principal?error=' + error);
                    }
                }
                else {
                    error = 'Caracteres no permitidos en el nombre';
                    return res.redirect('/rol/vista/inicio?error=' + error + texto);
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
    __param(0, common_1.Query()),
    __param(1, common_1.Res()),
    __param(2, common_1.Session()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], RolController.prototype, "obtenerUnidades", null);
__decorate([
    common_1.Post('crearDesdeVista'),
    __param(0, common_1.Body()),
    __param(1, common_1.Res()),
    __param(2, common_1.Session()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], RolController.prototype, "crearDesdeVista", null);
RolController = __decorate([
    common_1.Controller('rol'),
    __metadata("design:paramtypes", [rol_service_1.RolService])
], RolController);
exports.RolController = RolController;
//# sourceMappingURL=rol.controller.js.map
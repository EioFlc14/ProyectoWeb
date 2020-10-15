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
exports.UnidadController = void 0;
const common_1 = require("@nestjs/common");
const class_validator_1 = require("class-validator");
const unidad_service_1 = require("./unidad.service");
const unidad_create_dto_1 = require("./dto/unidad.create-dto");
let UnidadController = class UnidadController {
    constructor(_unidadService) {
        this._unidadService = _unidadService;
    }
    async obtenerUnidades(paramConsulta, res, session) {
        if (session.usuarioId) {
            let resultadoEncontrado;
            try {
                resultadoEncontrado = await this._unidadService.buscarTodos();
            }
            catch (e) {
                const error = 'Error al obtener unidades.';
                return res.redirect('/principal?error=' + error);
            }
            const esAdministrador = session.roles.some((rol) => rol == 'administrador');
            const esProductor = session.roles.some((rol) => rol == 'productor');
            const esCliente = session.roles.some((rol) => rol == 'cliente');
            if (resultadoEncontrado) {
                console.log(resultadoEncontrado);
                return res.render('unidad/inicio', {
                    arregloUnidades: resultadoEncontrado,
                    error: paramConsulta.error,
                    id: session.usuarioId,
                    esAdministrador: esAdministrador,
                    esProductor: esProductor,
                    esCliente: esCliente,
                });
            }
            else {
                const error = 'No hay unidades para mostrar.';
                return res.redirect('/principal?error=' + error);
            }
        }
        else {
            return res.redirect('/login');
        }
    }
    async crearDesdeVista(paramBody, res, session) {
        if (session.usuarioId) {
            let respuestaCreacionUnidad;
            const unidadCreado = new unidad_create_dto_1.UnidadCreateDto();
            unidadCreado.nombre = paramBody.nombre;
            const errores = await class_validator_1.validate(unidadCreado);
            const texto = `&nombre=${paramBody.nombre}`;
            if (errores.length > 0) {
                console.error('Errores:', errores);
                const error = 'Error en el formato de los datos.';
                return res.redirect('/unidad/vista/inicio?error=' + error + texto);
            }
            else {
                let error;
                const re = /^[\p{L}'][ \p{L}'-]*[\p{L}]$/u;
                if (re.test(paramBody.nombre)) {
                    try {
                        respuestaCreacionUnidad = await this._unidadService.crearUno(paramBody);
                    }
                    catch (e) {
                        console.error(e);
                        error = 'Error al crear la Unidad';
                        return res.redirect('/principal?error=' + error);
                    }
                    if (respuestaCreacionUnidad) {
                        const exito = 'Unidad creada exitosamente.';
                        return res.redirect('/principal?exito=' + exito);
                    }
                    else {
                        error = 'Error al crear la Unidad';
                        return res.redirect('/principal?error=' + error);
                    }
                }
                else {
                    error = 'Caracteres no permitidos en el nombre';
                    return res.redirect('/unidad/vista/inicio?error=' + error + texto);
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
], UnidadController.prototype, "obtenerUnidades", null);
__decorate([
    common_1.Post('crearDesdeVista'),
    __param(0, common_1.Body()),
    __param(1, common_1.Res()),
    __param(2, common_1.Session()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], UnidadController.prototype, "crearDesdeVista", null);
UnidadController = __decorate([
    common_1.Controller('unidad'),
    __metadata("design:paramtypes", [unidad_service_1.UnidadService])
], UnidadController);
exports.UnidadController = UnidadController;
//# sourceMappingURL=unidad.controller.js.map
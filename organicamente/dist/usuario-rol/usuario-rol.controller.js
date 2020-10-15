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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsuarioRolController = void 0;
const common_1 = require("@nestjs/common");
const usuario_rol_service_1 = require("./usuario-rol.service");
const usuario_service_1 = require("../usuario/usuario.service");
const rol_service_1 = require("../rol/rol.service");
let UsuarioRolController = class UsuarioRolController {
    constructor(_usuarioRolService, _usuarioService, _rolService) {
        this._usuarioRolService = _usuarioRolService;
        this._usuarioService = _usuarioService;
        this._rolService = _rolService;
    }
};
UsuarioRolController = __decorate([
    common_1.Controller('usuario-rol'),
    __metadata("design:paramtypes", [usuario_rol_service_1.UsuarioRolService,
        usuario_service_1.UsuarioService,
        rol_service_1.RolService])
], UsuarioRolController);
exports.UsuarioRolController = UsuarioRolController;
//# sourceMappingURL=usuario-rol.controller.js.map
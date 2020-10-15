"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsuarioRolModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const usuario_rol_entity_1 = require("./usuario-rol.entity");
const usuario_rol_controller_1 = require("./usuario-rol.controller");
const usuario_rol_service_1 = require("./usuario-rol.service");
const usuario_entity_1 = require("../usuario/usuario.entity");
const rol_entity_1 = require("../rol/rol.entity");
const usuario_service_1 = require("../usuario/usuario.service");
const rol_service_1 = require("../rol/rol.service");
let UsuarioRolModule = class UsuarioRolModule {
};
UsuarioRolModule = __decorate([
    common_1.Module({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([usuario_rol_entity_1.UsuarioRolEntity, usuario_entity_1.UsuarioEntity, rol_entity_1.RolEntity], 'default')
        ],
        controllers: [
            usuario_rol_controller_1.UsuarioRolController,
        ],
        providers: [
            usuario_rol_service_1.UsuarioRolService,
            usuario_service_1.UsuarioService,
            rol_service_1.RolService,
        ]
    })
], UsuarioRolModule);
exports.UsuarioRolModule = UsuarioRolModule;
//# sourceMappingURL=usuario-rol.module.js.map
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsuarioModule = void 0;
const common_1 = require("@nestjs/common");
const usuario_controller_1 = require("./usuario.controller");
const usuario_service_1 = require("./usuario.service");
const typeorm_1 = require("@nestjs/typeorm");
const usuario_entity_1 = require("./usuario.entity");
const rol_service_1 = require("../rol/rol.service");
const rol_entity_1 = require("../rol/rol.entity");
const usuario_rol_service_1 = require("../usuario-rol/usuario-rol.service");
const usuario_rol_entity_1 = require("../usuario-rol/usuario-rol.entity");
let UsuarioModule = class UsuarioModule {
};
UsuarioModule = __decorate([
    common_1.Module({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([usuario_entity_1.UsuarioEntity, rol_entity_1.RolEntity, usuario_rol_entity_1.UsuarioRolEntity], 'default')
        ],
        controllers: [
            usuario_controller_1.UsuarioController
        ],
        providers: [
            usuario_service_1.UsuarioService,
            rol_service_1.RolService,
            usuario_rol_service_1.UsuarioRolService,
        ]
    })
], UsuarioModule);
exports.UsuarioModule = UsuarioModule;
//# sourceMappingURL=usuario.module.js.map
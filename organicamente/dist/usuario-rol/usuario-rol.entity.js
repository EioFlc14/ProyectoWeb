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
exports.UsuarioRolEntity = void 0;
const typeorm_1 = require("typeorm");
const index_1 = require("typeorm/index");
const usuario_entity_1 = require("../usuario/usuario.entity");
const rol_entity_1 = require("../rol/rol.entity");
let UsuarioRolEntity = class UsuarioRolEntity {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn({
        name: 'usuario_rol_id',
        unsigned: true,
    }),
    __metadata("design:type", Number)
], UsuarioRolEntity.prototype, "usuarioRolId", void 0);
__decorate([
    index_1.ManyToOne(type => usuario_entity_1.UsuarioEntity, usuario => usuario.usuariosRoles),
    __metadata("design:type", usuario_entity_1.UsuarioEntity)
], UsuarioRolEntity.prototype, "usuario", void 0);
__decorate([
    index_1.ManyToOne(type => rol_entity_1.RolEntity, rol => rol.usuariosRoles),
    __metadata("design:type", rol_entity_1.RolEntity)
], UsuarioRolEntity.prototype, "rol", void 0);
UsuarioRolEntity = __decorate([
    typeorm_1.Entity('usuario_rol')
], UsuarioRolEntity);
exports.UsuarioRolEntity = UsuarioRolEntity;
//# sourceMappingURL=usuario-rol.entity.js.map
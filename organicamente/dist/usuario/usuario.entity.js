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
exports.UsuarioEntity = void 0;
const typeorm_1 = require("typeorm");
const index_1 = require("typeorm/index");
const factura_entity_1 = require("../factura/factura.entity");
const usuario_rol_entity_1 = require("../usuario-rol/usuario-rol.entity");
const usuario_producto_entity_1 = require("../usuario-producto/usuario-producto.entity");
let UsuarioEntity = class UsuarioEntity {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn({
        name: 'usuario_id',
        unsigned: true,
    }),
    __metadata("design:type", Number)
], UsuarioEntity.prototype, "usuarioId", void 0);
__decorate([
    typeorm_1.Column({
        name: 'nombre',
        type: 'varchar',
        length: '50',
        nullable: false,
    }),
    __metadata("design:type", String)
], UsuarioEntity.prototype, "nombre", void 0);
__decorate([
    typeorm_1.Column({
        name: 'apellido',
        type: 'varchar',
        length: '50',
        nullable: true,
    }),
    __metadata("design:type", String)
], UsuarioEntity.prototype, "apellido", void 0);
__decorate([
    typeorm_1.Column({
        name: 'username',
        type: 'varchar',
        length: '50',
        nullable: false,
    }),
    __metadata("design:type", String)
], UsuarioEntity.prototype, "username", void 0);
__decorate([
    typeorm_1.Column({
        name: 'password',
        type: 'varchar',
        length: '50',
        nullable: false,
    }),
    __metadata("design:type", String)
], UsuarioEntity.prototype, "password", void 0);
__decorate([
    typeorm_1.Column({
        name: 'email',
        type: 'varchar',
        length: '50',
        nullable: false,
    }),
    __metadata("design:type", String)
], UsuarioEntity.prototype, "email", void 0);
__decorate([
    typeorm_1.Column({
        name: 'telefono',
        type: 'varchar',
        length: '20',
        nullable: false,
    }),
    __metadata("design:type", String)
], UsuarioEntity.prototype, "telefono", void 0);
__decorate([
    typeorm_1.Column({
        name: 'direccion',
        type: 'varchar',
        length: '200',
        nullable: false,
    }),
    __metadata("design:type", String)
], UsuarioEntity.prototype, "direccion", void 0);
__decorate([
    typeorm_1.Column({
        name: 'identificacion',
        type: 'varchar',
        length: '30',
        nullable: false,
    }),
    __metadata("design:type", String)
], UsuarioEntity.prototype, "identificacion", void 0);
__decorate([
    index_1.OneToMany(type => factura_entity_1.FacturaEntity, factura => factura.usuario),
    __metadata("design:type", Array)
], UsuarioEntity.prototype, "facturas", void 0);
__decorate([
    index_1.OneToMany(type => usuario_rol_entity_1.UsuarioRolEntity, usuarioRol => usuarioRol.usuario),
    __metadata("design:type", Array)
], UsuarioEntity.prototype, "usuariosRoles", void 0);
__decorate([
    index_1.OneToMany(type => usuario_producto_entity_1.UsuarioProductoEntity, usuarioProducto => usuarioProducto.usuario),
    __metadata("design:type", Array)
], UsuarioEntity.prototype, "usuariosProductos", void 0);
UsuarioEntity = __decorate([
    typeorm_1.Entity('usuario')
], UsuarioEntity);
exports.UsuarioEntity = UsuarioEntity;
//# sourceMappingURL=usuario.entity.js.map
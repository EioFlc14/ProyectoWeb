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
exports.UsuarioProductoEntity = void 0;
const typeorm_1 = require("typeorm");
const index_1 = require("typeorm/index");
const producto_entity_1 = require("../producto/producto.entity");
const unidad_entity_1 = require("../unidad/unidad.entity");
const detalle_factura_entity_1 = require("../detalle-factura/detalle-factura.entity");
const usuario_entity_1 = require("../usuario/usuario.entity");
let UsuarioProductoEntity = class UsuarioProductoEntity {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn({
        name: 'usuario_producto_id',
        unsigned: true,
    }),
    __metadata("design:type", Number)
], UsuarioProductoEntity.prototype, "usuarioProductoId", void 0);
__decorate([
    typeorm_1.Column({
        name: 'stock',
        type: 'int',
        nullable: false,
    }),
    __metadata("design:type", Number)
], UsuarioProductoEntity.prototype, "stock", void 0);
__decorate([
    typeorm_1.Column({
        name: 'precio',
        type: "decimal",
        precision: 6,
        scale: 3,
        nullable: false,
    }),
    __metadata("design:type", Number)
], UsuarioProductoEntity.prototype, "precio", void 0);
__decorate([
    typeorm_1.Column({
        name: 'imagen',
        type: 'varchar',
        nullable: true
    }),
    __metadata("design:type", String)
], UsuarioProductoEntity.prototype, "imagen", void 0);
__decorate([
    index_1.ManyToOne(type => producto_entity_1.ProductoEntity, producto => producto.usuarioProductos),
    __metadata("design:type", producto_entity_1.ProductoEntity)
], UsuarioProductoEntity.prototype, "producto", void 0);
__decorate([
    index_1.ManyToOne(type => unidad_entity_1.UnidadEntity, unidad => unidad.usuarioProductos),
    __metadata("design:type", unidad_entity_1.UnidadEntity)
], UsuarioProductoEntity.prototype, "unidad", void 0);
__decorate([
    index_1.OneToMany(type => detalle_factura_entity_1.DetalleFacturaEntity, detalle_factura => detalle_factura.usuarioProducto),
    __metadata("design:type", Array)
], UsuarioProductoEntity.prototype, "detallesFacturas", void 0);
__decorate([
    index_1.ManyToOne(type => usuario_entity_1.UsuarioEntity, usuario => usuario.usuariosProductos),
    __metadata("design:type", usuario_entity_1.UsuarioEntity)
], UsuarioProductoEntity.prototype, "usuario", void 0);
UsuarioProductoEntity = __decorate([
    typeorm_1.Entity('usuario_producto')
], UsuarioProductoEntity);
exports.UsuarioProductoEntity = UsuarioProductoEntity;
//# sourceMappingURL=usuario-producto.entity.js.map
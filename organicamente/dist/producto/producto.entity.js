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
exports.ProductoEntity = void 0;
const typeorm_1 = require("typeorm");
const index_1 = require("typeorm/index");
const usuario_producto_entity_1 = require("../usuario-producto/usuario-producto.entity");
let ProductoEntity = class ProductoEntity {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn({
        name: 'producto_id',
        unsigned: true,
    }),
    __metadata("design:type", Number)
], ProductoEntity.prototype, "productoId", void 0);
__decorate([
    typeorm_1.Column({
        name: 'nombre',
        type: "varchar",
        length: '100',
        nullable: false,
    }),
    __metadata("design:type", String)
], ProductoEntity.prototype, "nombre", void 0);
__decorate([
    index_1.OneToMany(type => usuario_producto_entity_1.UsuarioProductoEntity, usuarioProducto => usuarioProducto.producto),
    __metadata("design:type", Array)
], ProductoEntity.prototype, "usuarioProductos", void 0);
ProductoEntity = __decorate([
    typeorm_1.Entity('producto')
], ProductoEntity);
exports.ProductoEntity = ProductoEntity;
//# sourceMappingURL=producto.entity.js.map
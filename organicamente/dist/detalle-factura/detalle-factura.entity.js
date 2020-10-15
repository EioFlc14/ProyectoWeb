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
exports.DetalleFacturaEntity = void 0;
const typeorm_1 = require("typeorm");
const index_1 = require("typeorm/index");
const usuario_producto_entity_1 = require("../usuario-producto/usuario-producto.entity");
const factura_entity_1 = require("../factura/factura.entity");
let DetalleFacturaEntity = class DetalleFacturaEntity {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn({
        name: 'detalle_factura_id',
        unsigned: true,
    }),
    __metadata("design:type", Number)
], DetalleFacturaEntity.prototype, "detalleFacturaId", void 0);
__decorate([
    typeorm_1.Column({
        name: 'cantidad',
        type: 'int',
        nullable: false,
    }),
    __metadata("design:type", Number)
], DetalleFacturaEntity.prototype, "cantidad", void 0);
__decorate([
    typeorm_1.Column({
        name: 'precio',
        type: "decimal",
        precision: 6,
        scale: 3,
        nullable: false,
    }),
    __metadata("design:type", Number)
], DetalleFacturaEntity.prototype, "precio", void 0);
__decorate([
    typeorm_1.Column({
        name: 'valor',
        type: "decimal",
        precision: 8,
        scale: 3,
        nullable: false,
    }),
    __metadata("design:type", Number)
], DetalleFacturaEntity.prototype, "valor", void 0);
__decorate([
    index_1.ManyToOne(type => usuario_producto_entity_1.UsuarioProductoEntity, usuarioProducto => usuarioProducto.detallesFacturas),
    __metadata("design:type", usuario_producto_entity_1.UsuarioProductoEntity)
], DetalleFacturaEntity.prototype, "usuarioProducto", void 0);
__decorate([
    index_1.ManyToOne(type => factura_entity_1.FacturaEntity, factura => factura.detallesFacturas),
    __metadata("design:type", factura_entity_1.FacturaEntity)
], DetalleFacturaEntity.prototype, "factura", void 0);
DetalleFacturaEntity = __decorate([
    typeorm_1.Entity('detalle_factura')
], DetalleFacturaEntity);
exports.DetalleFacturaEntity = DetalleFacturaEntity;
//# sourceMappingURL=detalle-factura.entity.js.map
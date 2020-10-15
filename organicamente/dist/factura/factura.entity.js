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
exports.FacturaEntity = void 0;
const typeorm_1 = require("typeorm");
const index_1 = require("typeorm/index");
const detalle_factura_entity_1 = require("../detalle-factura/detalle-factura.entity");
const usuario_entity_1 = require("../usuario/usuario.entity");
let FacturaEntity = class FacturaEntity {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn({
        name: 'factura_id',
        unsigned: true,
    }),
    __metadata("design:type", Number)
], FacturaEntity.prototype, "facturaId", void 0);
__decorate([
    typeorm_1.Column({
        name: 'total',
        type: "decimal",
        precision: 10,
        scale: 3,
        nullable: false,
    }),
    __metadata("design:type", Number)
], FacturaEntity.prototype, "total", void 0);
__decorate([
    typeorm_1.Column({
        name: 'fecha',
        type: "datetime",
        nullable: true,
    }),
    __metadata("design:type", String)
], FacturaEntity.prototype, "fecha", void 0);
__decorate([
    typeorm_1.Column({
        name: 'cumplido',
        type: "varchar",
        length: '5',
        nullable: false,
    }),
    __metadata("design:type", String)
], FacturaEntity.prototype, "cumplido", void 0);
__decorate([
    index_1.OneToMany(type => detalle_factura_entity_1.DetalleFacturaEntity, detalleFactura => detalleFactura.factura),
    __metadata("design:type", Array)
], FacturaEntity.prototype, "detallesFacturas", void 0);
__decorate([
    index_1.ManyToOne(type => usuario_entity_1.UsuarioEntity, usuario => usuario.facturas),
    __metadata("design:type", usuario_entity_1.UsuarioEntity)
], FacturaEntity.prototype, "usuario", void 0);
FacturaEntity = __decorate([
    typeorm_1.Entity('factura')
], FacturaEntity);
exports.FacturaEntity = FacturaEntity;
//# sourceMappingURL=factura.entity.js.map
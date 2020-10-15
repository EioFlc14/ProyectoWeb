"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FacturaModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const factura_entity_1 = require("./factura.entity");
const factura_controller_1 = require("./factura.controller");
const factura_service_1 = require("./factura.service");
const usuario_producto_entity_1 = require("../usuario-producto/usuario-producto.entity");
const usuario_producto_service_1 = require("../usuario-producto/usuario-producto.service");
const detalle_factura_entity_1 = require("../detalle-factura/detalle-factura.entity");
const detalle_factura_service_1 = require("../detalle-factura/detalle-factura.service");
let FacturaModule = class FacturaModule {
};
FacturaModule = __decorate([
    common_1.Module({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([factura_entity_1.FacturaEntity, usuario_producto_entity_1.UsuarioProductoEntity, detalle_factura_entity_1.DetalleFacturaEntity], 'default')
        ],
        controllers: [
            factura_controller_1.FacturaController,
        ],
        providers: [
            factura_service_1.FacturaService,
            usuario_producto_service_1.UsuarioProductoService,
            detalle_factura_service_1.DetalleFacturaService,
        ]
    })
], FacturaModule);
exports.FacturaModule = FacturaModule;
//# sourceMappingURL=factura.module.js.map
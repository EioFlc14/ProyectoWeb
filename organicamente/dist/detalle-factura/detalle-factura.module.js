"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DetalleFacturaModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const detalle_factura_entity_1 = require("./detalle-factura.entity");
const detalle_factura_controller_1 = require("./detalle-factura.controller");
const detalle_factura_service_1 = require("./detalle-factura.service");
const usuario_service_1 = require("../usuario/usuario.service");
const usuario_entity_1 = require("../usuario/usuario.entity");
let DetalleFacturaModule = class DetalleFacturaModule {
};
DetalleFacturaModule = __decorate([
    common_1.Module({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([detalle_factura_entity_1.DetalleFacturaEntity, usuario_entity_1.UsuarioEntity], 'default')
        ],
        controllers: [
            detalle_factura_controller_1.DetalleFacturaController,
        ],
        providers: [
            detalle_factura_service_1.DetalleFacturaService,
            usuario_service_1.UsuarioService
        ]
    })
], DetalleFacturaModule);
exports.DetalleFacturaModule = DetalleFacturaModule;
//# sourceMappingURL=detalle-factura.module.js.map
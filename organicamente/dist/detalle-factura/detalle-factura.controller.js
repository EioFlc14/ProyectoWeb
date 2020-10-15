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
exports.DetalleFacturaController = void 0;
const common_1 = require("@nestjs/common");
const detalle_factura_service_1 = require("./detalle-factura.service");
const usuario_service_1 = require("../usuario/usuario.service");
let DetalleFacturaController = class DetalleFacturaController {
    constructor(_detalleFacturaService, _usuarioService) {
        this._detalleFacturaService = _detalleFacturaService;
        this._usuarioService = _usuarioService;
    }
};
DetalleFacturaController = __decorate([
    common_1.Controller('detalle-factura'),
    __metadata("design:paramtypes", [detalle_factura_service_1.DetalleFacturaService,
        usuario_service_1.UsuarioService])
], DetalleFacturaController);
exports.DetalleFacturaController = DetalleFacturaController;
//# sourceMappingURL=detalle-factura.controller.js.map
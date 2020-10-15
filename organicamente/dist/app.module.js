"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const detalle_factura_module_1 = require("./detalle-factura/detalle-factura.module");
const factura_module_1 = require("./factura/factura.module");
const producto_module_1 = require("./producto/producto.module");
const rol_module_1 = require("./rol/rol.module");
const unidad_module_1 = require("./unidad/unidad.module");
const usuario_module_1 = require("./usuario/usuario.module");
const usuario_producto_module_1 = require("./usuario-producto/usuario-producto.module");
const usuario_rol_module_1 = require("./usuario-rol/usuario-rol.module");
const typeorm_1 = require("@nestjs/typeorm");
const detalle_factura_entity_1 = require("./detalle-factura/detalle-factura.entity");
const factura_entity_1 = require("./factura/factura.entity");
const producto_entity_1 = require("./producto/producto.entity");
const rol_entity_1 = require("./rol/rol.entity");
const unidad_entity_1 = require("./unidad/unidad.entity");
const usuario_entity_1 = require("./usuario/usuario.entity");
const usuario_producto_entity_1 = require("./usuario-producto/usuario-producto.entity");
const usuario_rol_entity_1 = require("./usuario-rol/usuario-rol.entity");
const usuario_service_1 = require("./usuario/usuario.service");
const rol_service_1 = require("./rol/rol.service");
const usuario_rol_service_1 = require("./usuario-rol/usuario-rol.service");
let AppModule = class AppModule {
};
AppModule = __decorate([
    common_1.Module({
        imports: [
            detalle_factura_module_1.DetalleFacturaModule,
            factura_module_1.FacturaModule,
            producto_module_1.ProductoModule,
            rol_module_1.RolModule,
            unidad_module_1.UnidadModule,
            usuario_module_1.UsuarioModule,
            usuario_producto_module_1.UsuarioProductoModule,
            usuario_rol_module_1.UsuarioRolModule,
            typeorm_1.TypeOrmModule.forRoot({
                name: 'default',
                type: 'mysql',
                host: 'localhost',
                port: 3306,
                username: 'root',
                password: 'root',
                database: 'organicamente',
                entities: [
                    detalle_factura_entity_1.DetalleFacturaEntity,
                    factura_entity_1.FacturaEntity,
                    producto_entity_1.ProductoEntity,
                    rol_entity_1.RolEntity,
                    unidad_entity_1.UnidadEntity,
                    usuario_entity_1.UsuarioEntity,
                    usuario_producto_entity_1.UsuarioProductoEntity,
                    usuario_rol_entity_1.UsuarioRolEntity,
                ],
                synchronize: false,
                dropSchema: false
            }),
            typeorm_1.TypeOrmModule.forFeature([usuario_entity_1.UsuarioEntity, rol_entity_1.RolEntity, usuario_rol_entity_1.UsuarioRolEntity], 'default')
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService, usuario_service_1.UsuarioService, rol_service_1.RolService, usuario_rol_service_1.UsuarioRolService],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map
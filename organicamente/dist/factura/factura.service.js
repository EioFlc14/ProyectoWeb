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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FacturaService = void 0;
const typeorm_1 = require("@nestjs/typeorm");
const index_1 = require("typeorm/index");
const common_1 = require("@nestjs/common");
const factura_entity_1 = require("./factura.entity");
const typeorm_2 = require("typeorm");
let FacturaService = class FacturaService {
    constructor(repositorio) {
        this.repositorio = repositorio;
    }
    crearUno(nuevaFactura) {
        return this.repositorio.save(nuevaFactura);
    }
    async buscarTodos(busqueda) {
        return await typeorm_2.getManager('default')
            .query(`select 
                            f.factura_id as 'facturaId', f.total, f.fecha, f.cumplido,
                            df.cantidad, df.precio,
                            up.imagen as 'imagen',
                            p.nombre as 'producto',
                            u.nombre as 'unidad',
                            c.nombre as 'nombreC', c.apellido as 'apellidoC', c.telefono as 'telefonoC', c.direccion as 'direccionC', c.email as 'emailC', c.identificacion as 'identificacionC',
                            pr.nombre as 'nombreP', pr.apellido as 'apellidoP', pr.telefono as 'telefonoP', pr.direccion as 'direccionP', pr.email as 'emailP', pr.identificacion as 'identificacionP'
                            from factura f 
                            join usuario c on f.usuarioUsuarioId = c.usuario_id
                            join detalle_factura df on df.facturaFacturaId = f.factura_id
                            join usuario_producto up on df.usuarioProductoUsuarioProductoId = up.usuario_producto_id
                            join producto p on up.productoProductoId = p.producto_id
                            join unidad u on up.unidadUnidadId = u.unidad_id
                            join usuario pr on up.usuarioUsuarioId = pr.usuario_id
                            where p.nombre LIKE '%${busqueda}%' or pr.nombre LIKE '%${busqueda}%' or pr.apellido LIKE '%${busqueda}%';`);
    }
    async buscarTodosUnUsuario(id, busqueda) {
        return await typeorm_2.getManager('default')
            .query(`select 
                            f.factura_id as 'facturaId', f.total, f.fecha, f.cumplido,
                            df.cantidad, df.precio,
                            up.imagen as 'imagen',
                            p.nombre as 'producto',
                            u.nombre as 'unidad',
                            c.nombre as 'nombreC', c.apellido as 'apellidoC', c.telefono as 'telefonoC', c.direccion as 'direccionC', c.email as 'emailC', c.identificacion as 'identificacionC',
                            pr.nombre as 'nombreP', pr.apellido as 'apellidoP', pr.telefono as 'telefonoP', pr.direccion as 'direccionP', pr.email as 'emailP', pr.identificacion as 'identificacionP'
                            from factura f 
                            join usuario c on (f.usuarioUsuarioId = c.usuario_id and c.usuario_id = ${id})
                            join detalle_factura df on df.facturaFacturaId = f.factura_id
                            join usuario_producto up on df.usuarioProductoUsuarioProductoId = up.usuario_producto_id
                            join producto p on up.productoProductoId = p.producto_id
                            join unidad u on up.unidadUnidadId = u.unidad_id
                            join usuario pr on up.usuarioUsuarioId = pr.usuario_id
                            where p.nombre LIKE '%${busqueda}%' or pr.nombre LIKE '%${busqueda}%' or pr.apellido LIKE '%${busqueda}%';`);
    }
    async buscarFacturasEspecificas(id, busqueda) {
        return await typeorm_2.getManager('default')
            .query(`select 
                            f.factura_id as 'facturaId', f.total, f.fecha, f.cumplido,
                            df.cantidad, df.precio,
                            up.imagen as 'imagen',
                            p.nombre as 'producto',
                            u.nombre as 'unidad',
                            c.nombre as 'nombreC', c.apellido as 'apellidoC', c.telefono as 'telefonoC', c.direccion as 'direccionC', c.email as 'emailC', c.identificacion as 'identificacionC',
                            pr.nombre as 'nombreP', pr.apellido as 'apellidoP', pr.telefono as 'telefonoP', pr.direccion as 'direccionP', pr.email as 'emailP', pr.identificacion as 'identificacionP'
                            from factura f 
                            join usuario c on f.usuarioUsuarioId = c.usuario_id
                            join detalle_factura df on df.facturaFacturaId = f.factura_id
                            join usuario_producto up on df.usuarioProductoUsuarioProductoId = up.usuario_producto_id
                            join producto p on up.productoProductoId = p.producto_id
                            join unidad u on up.unidadUnidadId = u.unidad_id
                            join usuario pr on (up.usuarioUsuarioId = pr.usuario_id and pr.usuario_id = ${id})
                            where p.nombre LIKE '%${busqueda}%' or pr.nombre LIKE '%${busqueda}%' or pr.apellido LIKE '%${busqueda}%' ;`);
    }
    async buscarUno(id) {
        return await typeorm_2.getManager('default')
            .query(`select 
                            f.factura_id as 'facturaId', f.total, f.fecha, f.cumplido,
                            df.cantidad, df.precio,
                            up.imagen as 'imagen',
                            p.nombre as 'producto',
                            u.nombre as 'unidad',
                            c.nombre as 'nombreC', c.apellido as 'apellidoC', c.telefono as 'telefonoC', c.direccion as 'direccionC', c.email as 'emailC', c.identificacion as 'identificacionC',
                            pr.nombre as 'nombreP', pr.apellido as 'apellidoP', pr.telefono as 'telefonoP', pr.direccion as 'direccionP', pr.email as 'emailP', pr.identificacion as 'identificacionP'
                            from factura f
                            join usuario c on (f.usuarioUsuarioId = c.usuario_id and f.factura_id = ${id}) 
                            join detalle_factura df on df.facturaFacturaId = f.factura_id
                            join usuario_producto up on df.usuarioProductoUsuarioProductoId = up.usuario_producto_id
                            join producto p on up.productoProductoId = p.producto_id
                            join unidad u on up.unidadUnidadId = u.unidad_id
                            join usuario pr on up.usuarioUsuarioId = pr.usuario_id;`);
    }
    editarUno(facturaEditada) {
        return this.repositorio.save(facturaEditada);
    }
    eliminarUno(id) {
        return this.repositorio.delete(id);
    }
};
FacturaService = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_1.InjectRepository(factura_entity_1.FacturaEntity)),
    __metadata("design:paramtypes", [index_1.Repository])
], FacturaService);
exports.FacturaService = FacturaService;
//# sourceMappingURL=factura.service.js.map
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
exports.UsuarioProductoService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const index_1 = require("typeorm/index");
const usuario_producto_entity_1 = require("./usuario-producto.entity");
const typeorm_2 = require("typeorm");
let UsuarioProductoService = class UsuarioProductoService {
    constructor(repositorio) {
        this.repositorio = repositorio;
    }
    crearUno(usuarioProducto) {
        return this.repositorio.save(usuarioProducto);
    }
    buscarTodos() {
        return this.repositorio.find({ relations: ['producto', 'unidad', 'usuario'] });
    }
    buscarUno(id) {
        return this.repositorio.findOne(id, { relations: ['producto', 'unidad', 'usuario'] });
    }
    buscarEspecificosProductor(id) {
        let busquedaEjemplo;
        busquedaEjemplo = {
            where: [
                {
                    usuario: id,
                }
            ],
            relations: ['producto', 'unidad', 'usuario']
        };
        return this.repositorio.find(busquedaEjemplo);
    }
    async busquedaProductoCamposClienteAdmin(busqueda) {
        return await typeorm_2.getManager('default')
            .query(`select us.nombre as 'nombre', us.apellido as 'apellido', us.username as 'username',  up.stock as 'stock', 
                            up.precio as 'precio', u.nombre as 'unidad', p.nombre as 'producto', up.imagen as 'imagen', up.usuario_producto_id as 'usuarioProductoId', us.usuario_id as 'usuarioId' 
                            from usuario_producto up 
                            join producto p on up.productoProductoId = p.producto_id 
                            join unidad u on up.unidadUnidadId = u.unidad_id 
                            join usuario us on up.usuarioUsuarioId = us.usuario_id 
                            where u.nombre LIKE '%${busqueda}%' or p.nombre LIKE '%${busqueda}%' or us.nombre LIKE '%${busqueda}%' or us.apellido LIKE '%${busqueda}%';`);
    }
    async busquedaProductoCamposProductor(busqueda, id) {
        return await typeorm_2.getManager('default')
            .query(`select us.nombre as 'nombre', us.apellido as 'apellido', us.username as 'username',  up.stock as 'stock', 
                            up.precio as 'precio', u.nombre as 'unidad', p.nombre as 'producto', up.imagen as 'imagen', up.usuario_producto_id as 'usuarioProductoId', us.usuario_id as 'usuarioId'  
                            from usuario_producto up 
                            join producto p on up.productoProductoId = p.producto_id 
                            join unidad u on up.unidadUnidadId = u.unidad_id 
                            join usuario us on up.usuarioUsuarioId = us.usuario_id and up.usuarioUsuarioId = ${id}
                            where u.nombre LIKE '%${busqueda}%' or p.nombre LIKE '%${busqueda}%' or us.nombre LIKE '%${busqueda}%' or us.apellido LIKE '%${busqueda}%';`);
    }
    editarUno(usuarioProductoEditado) {
        return this.repositorio.save(usuarioProductoEditado);
    }
    eliminarUno(id) {
        return this.repositorio.delete(id);
    }
};
UsuarioProductoService = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_1.InjectRepository(usuario_producto_entity_1.UsuarioProductoEntity)),
    __metadata("design:paramtypes", [index_1.Repository])
], UsuarioProductoService);
exports.UsuarioProductoService = UsuarioProductoService;
//# sourceMappingURL=usuario-producto.service.js.map
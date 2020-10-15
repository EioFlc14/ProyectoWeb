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
exports.UsuarioRolService = void 0;
const typeorm_1 = require("@nestjs/typeorm");
const index_1 = require("typeorm/index");
const usuario_rol_entity_1 = require("./usuario-rol.entity");
const typeorm_2 = require("typeorm");
let UsuarioRolService = class UsuarioRolService {
    constructor(repositorio) {
        this.repositorio = repositorio;
    }
    crearUno(usuarioRol) {
        return this.repositorio.save(usuarioRol);
    }
    buscarTodos() {
        return this.repositorio.find({ relations: ['usuario', 'rol'] });
    }
    buscarUno(id) {
        return this.repositorio.findOne(id);
    }
    async buscarRolesUnUsuario(usuarioId) {
        return await typeorm_2.getManager('default')
            .query(`select r.rol_id as 'rolId', r.nombre as 'rol' 
                            from usuario_rol ur 
                            join rol r on (ur.rolRolId = r.rol_id and ur.usuarioUsuarioId = ${usuarioId});`);
    }
    editarUno(usuarioRolEditado) {
        return this.repositorio.save(usuarioRolEditado);
    }
    async eliminarUno(id) {
        return await typeorm_2.getManager('default')
            .query(`delete from usuario_rol where usuarioUsuarioId = ${id};`);
    }
};
UsuarioRolService = __decorate([
    __param(0, typeorm_1.InjectRepository(usuario_rol_entity_1.UsuarioRolEntity)),
    __metadata("design:paramtypes", [index_1.Repository])
], UsuarioRolService);
exports.UsuarioRolService = UsuarioRolService;
//# sourceMappingURL=usuario-rol.service.js.map
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
exports.UsuarioService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const usuario_entity_1 = require("./usuario.entity");
const typeorm_2 = require("typeorm");
let UsuarioService = class UsuarioService {
    constructor(repositorio) {
        this.repositorio = repositorio;
    }
    crearUno(nuevoUsuario) {
        return this.repositorio.save(nuevoUsuario);
    }
    buscarTodos(textoBusqueda) {
        let busqueda;
        busqueda = {
            where: [
                {
                    identificacion: typeorm_2.Like(`%${textoBusqueda}%`)
                },
                {
                    nombre: typeorm_2.Like(`%${textoBusqueda}%`),
                },
                {
                    apellido: typeorm_2.Like(`%${textoBusqueda}%`),
                },
                {
                    username: typeorm_2.Like(`%${textoBusqueda}%`),
                },
                {
                    email: typeorm_2.Like(`%${textoBusqueda}%`),
                },
                {
                    telefono: typeorm_2.Like(`%${textoBusqueda}%`),
                }
            ]
        };
        return this.repositorio.find(busqueda);
    }
    buscarUno(id) {
        return this.repositorio.findOne(id);
    }
    editarUno(usuarioEditado) {
        return this.repositorio.save(usuarioEditado);
    }
    eliminarUno(id) {
        return this.repositorio.delete(id);
    }
    validarLogin(user, pswd) {
        let busquedaEjemplo;
        busquedaEjemplo = {
            where: [
                {
                    email: user,
                    password: pswd,
                },
                {
                    username: user,
                    password: pswd,
                }
            ]
        };
        return this.repositorio.find(busquedaEjemplo);
    }
    emailRegistrado(email) {
        let busquedaEjemplo;
        busquedaEjemplo = {
            where: [
                {
                    email: email,
                }
            ]
        };
        return this.repositorio.find(busquedaEjemplo);
    }
    usernameRegistrado(username) {
        let busquedaEjemplo;
        busquedaEjemplo = {
            where: [
                {
                    username: username,
                }
            ]
        };
        return this.repositorio.find(busquedaEjemplo);
    }
};
UsuarioService = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_1.InjectRepository(usuario_entity_1.UsuarioEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UsuarioService);
exports.UsuarioService = UsuarioService;
//# sourceMappingURL=usuario.service.js.map
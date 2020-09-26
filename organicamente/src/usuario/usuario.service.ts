import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {UsuarioEntity} from "./usuario.entity";
import {FindManyOptions, Like, Repository} from "typeorm";

@Injectable()
export class  UsuarioService {

    constructor(
        @InjectRepository(UsuarioEntity)
        private repositorio: Repository<UsuarioEntity>
    ) {
    }

    crearUno(nuevoUsuario: UsuarioEntity){
        return this.repositorio.save(nuevoUsuario) // promesa
    }

    buscarTodos(textoBusqueda:string){

        let busqueda: FindManyOptions<UsuarioEntity>

        busqueda = {
            where: [
                {
                    identificacion: Like(`%${textoBusqueda}%`)
                },
                {
                    nombre: Like(`%${textoBusqueda}%`),
                },
                {
                    apellido: Like(`%${textoBusqueda}%`),
                },
                {
                    username: Like(`%${textoBusqueda}%`),
                },
                {
                    email: Like(`%${textoBusqueda}%`),
                },
                {
                    telefono: Like(`%${textoBusqueda}%`),
                }
            ]
        }

        return this.repositorio.find(busqueda)
    }

    buscarUno(id: number){
        return this.repositorio.findOne(id)
    }

    editarUno(usuarioEditado:UsuarioEntity){
        return this.repositorio.save(usuarioEditado)
    }

    eliminarUno(id:number){
        return this.repositorio.delete(id)
    }

    validarLogin(user:string, pswd: string){

        let busquedaEjemplo: FindManyOptions<UsuarioEntity>

        busquedaEjemplo = {
            where: [
                {
                    email: user, // AND
                    password: pswd,
                },
                {
                    username: user,
                    password: pswd,

                }
            ]
        }

        return this.repositorio.find(busquedaEjemplo)
    }

    emailRegistrado(email: string){
        let busquedaEjemplo: FindManyOptions<UsuarioEntity>

        busquedaEjemplo = {
            where: [
                {
                    email: email,
                }
            ]
        }

        return this.repositorio.find(busquedaEjemplo)
    }


    usernameRegistrado(username: string){
        let busquedaEjemplo: FindManyOptions<UsuarioEntity>

        busquedaEjemplo = {
            where: [
                {
                    username: username,
                }
            ]
        }

        return this.repositorio.find(busquedaEjemplo)
    }

}


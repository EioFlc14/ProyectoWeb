import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm/index";
import {UsuarioRolEntity} from "./usuario-rol.entity";


export class UsuarioRolService{

    constructor( //Inyeccion de dependencias
        @InjectRepository(UsuarioRolEntity)
        private repositorio: Repository<UsuarioRolEntity>
    ) {
    }


    crearUno(usuarioRol: UsuarioRolEntity){
        return this.repositorio.save(usuarioRol) // promesa
    }

    buscarTodos(){
        return this.repositorio.find()
    }

    buscarUno(id: number){
        return this.repositorio.findOne(id)
    }

    editarUno(usuarioRolEditado:UsuarioRolEntity){
        return this.repositorio.save(usuarioRolEditado)
    }

    eliminarUno(id:number){
        return this.repositorio.delete(id)
    }


}
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm/index";
import {UsuarioRolEntity} from "./usuario-rol.entity";
import {FindManyOptions, getManager} from "typeorm";


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
        return this.repositorio.find({relations:['usuario','rol']})
    }

    buscarUno(id: number){
        return this.repositorio.findOne(id)
    }

    async buscarRolesUnUsuario(usuarioId:number){
        return await getManager('default')
            .query(`select r.rol_id as 'rolId', r.nombre as 'rol' 
                            from usuario_rol ur 
                            join rol r on (ur.rolRolId = r.rol_id and ur.usuarioUsuarioId = ${usuarioId});`)

    }



    editarUno(usuarioRolEditado:UsuarioRolEntity){
        return this.repositorio.save(usuarioRolEditado)
    }

    async eliminarUno(id:number){
        return await getManager('default')
            .query(`delete from usuario_rol where usuarioUsuarioId = ${id};`)

    }


}
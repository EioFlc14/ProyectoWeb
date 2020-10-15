import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm/index";
import {RolEntity} from "./rol.entity";
import {FindManyOptions} from "typeorm";
import {UsuarioEntity} from "../usuario/usuario.entity";


@Injectable()
export class RolService{

    constructor(
        @InjectRepository(RolEntity)
        private repositorio: Repository<RolEntity>
    ) {
    }

    crearUno(rol: RolEntity){
        return this.repositorio.save(rol)
    }

    buscarTodos(){
        return this.repositorio.find()
    }

    buscarUno(id: number){
        return this.repositorio.findOne(id)
    }

    buscarUnoNombre(nombre:string){
        let busquedaEjemplo: FindManyOptions<RolEntity>

        busquedaEjemplo = {
            where: [
                {
                    nombre: nombre, // AND
                }
            ]
        }

        return this.repositorio.findOne(busquedaEjemplo)
    }

    editarUno(rolEditado: RolEntity){
        return this.repositorio.save(rolEditado)
    }

    eliminarUno(id: number){
        return this.repositorio.delete(id)
    }


}
import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm/index";
import {RolEntity} from "./rol.entity";


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

    editarUno(rolEditado: RolEntity){
        return this.repositorio.save(rolEditado)
    }

    eliminarUno(id: number){
        return this.repositorio.delete(id)
    }


}
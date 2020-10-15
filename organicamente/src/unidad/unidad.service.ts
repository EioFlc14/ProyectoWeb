import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm/index";
import {UnidadEntity} from "./unidad.entity";


@Injectable()
export class UnidadService{

    constructor(
        @InjectRepository(UnidadEntity)
        private repositorio: Repository<UnidadEntity>
    ) {
    }

    crearUno(unidad: UnidadEntity){
        return this.repositorio.save(unidad)
    }

    buscarTodos(){
        return this.repositorio.find()
    }

    buscarUno(id: number){
        return this.repositorio.findOne(id)
    }

    editarUno(unidadEditada: UnidadEntity){
        return this.repositorio.save(unidadEditada)
    }

    eliminarUno(id: number){
        return this.repositorio.delete(id)
    }


}
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm/index";
import {Injectable} from "@nestjs/common";
import {ImagenEntity} from "./imagen.entity";

@Injectable()
export class ImagenService{

    constructor(
        @InjectRepository(ImagenEntity)
        private repositorio: Repository<ImagenEntity>
    ) {
    }

    crearUno(imagen: ImagenEntity){
        return this.repositorio.save(imagen)
    }

    buscarTodos(){
        return this.repositorio.find()
    }

    buscarUno(id: number){
        return this.repositorio.findOne(id)
    }

    /* editarUno(imagenEditada: ImagenEntity){
        return this.repositorio.save(imagenEditada)
    } */

    eliminarUno(id: number){
        return this.repositorio.delete(id)
    }


}
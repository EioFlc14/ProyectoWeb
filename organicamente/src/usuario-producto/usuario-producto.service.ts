import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm/index";
import {UsuarioProductoEntity} from "./usuario-producto.entity";

@Injectable()
export class UsuarioProductoService{

    constructor( //Inyeccion de dependencias
        @InjectRepository(UsuarioProductoEntity)
        private repositorio: Repository<UsuarioProductoEntity>

    ) {
    }


    crearUno(usuarioProducto: UsuarioProductoEntity){
        return this.repositorio.save(usuarioProducto) // promesa
    }

    buscarTodos(){
        return this.repositorio.find()
    }

    buscarUno(id: number){
        return this.repositorio.findOne(id)
    }

    editarUno(usuarioProductoEditado:UsuarioProductoEntity){
        return this.repositorio.save(usuarioProductoEditado)
    }

    eliminarUno(id:number){
        return this.repositorio.delete(id)
    }


}
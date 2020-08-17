import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm/index";
import {ProductoEntity} from "./producto.entity";
import {Injectable} from "@nestjs/common";


@Injectable()
export class ProductoService{

    constructor(
        @InjectRepository(ProductoEntity)
        private repositorio: Repository<ProductoEntity>
    ) {
    }

    crearUno(producto: ProductoEntity){
        return this.repositorio.save(producto)
    }

    buscarTodos(){
        return this.repositorio.find()
    }

    buscarUno(id: number){
        return this.repositorio.findOne(id)
    }

    editarUno(productoEditado: ProductoEntity){
        return this.repositorio.save(productoEditado)
    }

    eliminarUno(id: number){
        return this.repositorio.delete(id)
    }



}
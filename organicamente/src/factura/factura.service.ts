import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm/index";
import {Injectable} from "@nestjs/common";
import {FacturaEntity} from "./factura.entity";


@Injectable()
export class FacturaService{

    constructor(
        @InjectRepository(FacturaEntity)
        private repositorio: Repository<FacturaEntity>
    ) {
    }

    crearUno(nuevaFactura: FacturaEntity){
        return this.repositorio.save(nuevaFactura)
    }

    buscarTodos(){
        return this.repositorio.find()
    }

    buscarUno(id: number){
        return this.repositorio.findOne(id)
    }

    editarUno(facturaEditada: FacturaEntity){
        return this.repositorio.save(facturaEditada)
    }

    eliminarUno(id: number){
        return this.repositorio.delete(id)
    }


}
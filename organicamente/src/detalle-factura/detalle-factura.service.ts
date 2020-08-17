import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {DetalleFacturaEntity} from "./detalle-factura.entity";
import {Repository} from "typeorm/index";

@Injectable()
export class DetalleFacturaService{

    constructor(
        @InjectRepository(DetalleFacturaEntity)
        private repositorio: Repository<DetalleFacturaEntity>
    ) {
    }

    crearUno(nuevoDetalleFactura: DetalleFacturaEntity){
        return this.repositorio.save(nuevoDetalleFactura)
    }

    buscarTodos(){
        return this.repositorio.find()
    }

    buscarUno(id: number){
        return this.repositorio.findOne(id)
    }

    editarUno(detalleFacturaEditado: DetalleFacturaEntity){
        return this.repositorio.save(detalleFacturaEditado)
    }

    eliminarUno(id: number){
        return this.repositorio.delete(id)
    }

}
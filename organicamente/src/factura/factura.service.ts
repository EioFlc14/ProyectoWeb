import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm/index";
import {Injectable} from "@nestjs/common";
import {FacturaEntity} from "./factura.entity";
import {getManager} from "typeorm";


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
        return this.repositorio.find({relations:['usuario']})
    }

    buscarTodosUnUsuario(id:number){
        return this.repositorio.find({
            relations:[
                'usuario'
            ],
            where: [
                {
                    usuario: id
                }
            ]
        })
    }

    async buscarFacturasEspecificas(id:number){
        return await getManager('default')
            .query(`select f.*, df.cantidad, df.precio as 'Precio vendido', df.valor, up.imagen, u.nombre as 'unidad' 
                            from factura f 
                            inner join detalle_factura df on df.facturaFacturaId = f.factura_id
                            inner join usuario_producto up on up.usuario_producto_id = df.usuarioProductoUsuarioProductoId and up.usuarioUsuarioId = ${id}
                            inner join unidad u on up.unidadUnidadId = u.unidad_id;`)

    }


    buscarUno(id: number){
        return this.repositorio.findOne(id,{relations:['usuario']})
    }

    editarUno(facturaEditada: FacturaEntity){
        return this.repositorio.save(facturaEditada)
    }

    eliminarUno(id: number){
        return this.repositorio.delete(id)
    }


}
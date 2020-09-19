import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {DetalleFacturaEntity} from "./detalle-factura.entity";
import {createQueryBuilder, Repository, getRepository, getManager, EntityManager} from "typeorm/index";

@Injectable()
export class DetalleFacturaService {

    constructor(
        @InjectRepository(DetalleFacturaEntity)
        private repositorio: Repository<DetalleFacturaEntity>
    ) {
    }

    crearUno(nuevoDetalleFactura: DetalleFacturaEntity) {
        return this.repositorio.save(nuevoDetalleFactura)
    }

    /*
        async buscarTodos(){ // todos los detalles facturas de todas las facturas
            return await getManager('default')
            .query(`select df.*, p.nombre from detalle_factura df inner join usuario_producto up on df.usuarioProductoUsuarioProductoId = up.usuario_producto_id inner join producto p on up.productoProductoId = p.producto_id;`)
        }
    */

    async buscarTodos(id: number) { // todos los detalles facturas de todas las facturas
        return await getManager('default')
            .query(`select df.*, p.nombre, up.imagen from detalle_factura df inner join usuario_producto up on df.usuarioProductoUsuarioProductoId = up.usuario_producto_id inner join producto p on up.productoProductoId = p.producto_id where df.facturaFacturaId = ${id};`)
    }


    buscarUno(id: number) {
        return this.repositorio.findOne(id)
    }

    editarUno(detalleFacturaEditado: DetalleFacturaEntity) {
        return this.repositorio.save(detalleFacturaEditado)
    }

    eliminarUno(id: number) {
        return this.repositorio.delete(id)
    }

}
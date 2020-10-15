import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm/index";
import {Injectable} from "@nestjs/common";
import {FacturaEntity} from "./factura.entity";
import {getManager} from "typeorm";


@Injectable()
export class FacturaService {

    constructor(
        @InjectRepository(FacturaEntity)
        private repositorio: Repository<FacturaEntity>
    ) {
    }

    crearUno(nuevaFactura: FacturaEntity) {
        return this.repositorio.save(nuevaFactura)
    }

    async buscarTodos(busqueda:string) { // para el adminsitrador
        return await getManager('default')
            .query(`select 
                            f.factura_id as 'facturaId', f.total, f.fecha, f.cumplido,
                            df.cantidad, df.precio,
                            up.imagen as 'imagen',
                            p.nombre as 'producto',
                            u.nombre as 'unidad',
                            c.nombre as 'nombreC', c.apellido as 'apellidoC', c.telefono as 'telefonoC', c.direccion as 'direccionC', c.email as 'emailC', c.identificacion as 'identificacionC',
                            pr.nombre as 'nombreP', pr.apellido as 'apellidoP', pr.telefono as 'telefonoP', pr.direccion as 'direccionP', pr.email as 'emailP', pr.identificacion as 'identificacionP'
                            from factura f 
                            join usuario c on f.usuarioUsuarioId = c.usuario_id
                            join detalle_factura df on df.facturaFacturaId = f.factura_id
                            join usuario_producto up on df.usuarioProductoUsuarioProductoId = up.usuario_producto_id
                            join producto p on up.productoProductoId = p.producto_id
                            join unidad u on up.unidadUnidadId = u.unidad_id
                            join usuario pr on up.usuarioUsuarioId = pr.usuario_id
                            where p.nombre LIKE '%${busqueda}%' or pr.nombre LIKE '%${busqueda}%' or pr.apellido LIKE '%${busqueda}%';`)
    }

    async buscarTodosUnUsuario(id: number, busqueda: string) { // todas las facturas de un cliente
        return await getManager('default')
            .query(`select 
                            f.factura_id as 'facturaId', f.total, f.fecha, f.cumplido,
                            df.cantidad, df.precio,
                            up.imagen as 'imagen',
                            p.nombre as 'producto',
                            u.nombre as 'unidad',
                            c.nombre as 'nombreC', c.apellido as 'apellidoC', c.telefono as 'telefonoC', c.direccion as 'direccionC', c.email as 'emailC', c.identificacion as 'identificacionC',
                            pr.nombre as 'nombreP', pr.apellido as 'apellidoP', pr.telefono as 'telefonoP', pr.direccion as 'direccionP', pr.email as 'emailP', pr.identificacion as 'identificacionP'
                            from factura f 
                            join usuario c on (f.usuarioUsuarioId = c.usuario_id and c.usuario_id = ${id})
                            join detalle_factura df on df.facturaFacturaId = f.factura_id
                            join usuario_producto up on df.usuarioProductoUsuarioProductoId = up.usuario_producto_id
                            join producto p on up.productoProductoId = p.producto_id
                            join unidad u on up.unidadUnidadId = u.unidad_id
                            join usuario pr on up.usuarioUsuarioId = pr.usuario_id
                            where p.nombre LIKE '%${busqueda}%' or pr.nombre LIKE '%${busqueda}%' or pr.apellido LIKE '%${busqueda}%';`)

    }

    async buscarFacturasEspecificas(id: number, busqueda:string) { // todas las facturas de un productor
        return await getManager('default')
            .query(`select 
                            f.factura_id as 'facturaId', f.total, f.fecha, f.cumplido,
                            df.cantidad, df.precio,
                            up.imagen as 'imagen',
                            p.nombre as 'producto',
                            u.nombre as 'unidad',
                            c.nombre as 'nombreC', c.apellido as 'apellidoC', c.telefono as 'telefonoC', c.direccion as 'direccionC', c.email as 'emailC', c.identificacion as 'identificacionC',
                            pr.nombre as 'nombreP', pr.apellido as 'apellidoP', pr.telefono as 'telefonoP', pr.direccion as 'direccionP', pr.email as 'emailP', pr.identificacion as 'identificacionP'
                            from factura f 
                            join usuario c on f.usuarioUsuarioId = c.usuario_id
                            join detalle_factura df on df.facturaFacturaId = f.factura_id
                            join usuario_producto up on df.usuarioProductoUsuarioProductoId = up.usuario_producto_id
                            join producto p on up.productoProductoId = p.producto_id
                            join unidad u on up.unidadUnidadId = u.unidad_id
                            join usuario pr on (up.usuarioUsuarioId = pr.usuario_id and pr.usuario_id = ${id})
                            where p.nombre LIKE '%${busqueda}%' or pr.nombre LIKE '%${busqueda}%' or pr.apellido LIKE '%${busqueda}%' ;`)
    }


    async buscarUno(id: number) { // buscar una factura específica por su ID
        return await getManager('default')
            .query(`select 
                            f.factura_id as 'facturaId', f.total, f.fecha, f.cumplido,
                            df.cantidad, df.precio,
                            up.imagen as 'imagen',
                            p.nombre as 'producto',
                            u.nombre as 'unidad',
                            c.nombre as 'nombreC', c.apellido as 'apellidoC', c.telefono as 'telefonoC', c.direccion as 'direccionC', c.email as 'emailC', c.identificacion as 'identificacionC',
                            pr.nombre as 'nombreP', pr.apellido as 'apellidoP', pr.telefono as 'telefonoP', pr.direccion as 'direccionP', pr.email as 'emailP', pr.identificacion as 'identificacionP'
                            from factura f
                            join usuario c on (f.usuarioUsuarioId = c.usuario_id and f.factura_id = ${id}) 
                            join detalle_factura df on df.facturaFacturaId = f.factura_id
                            join usuario_producto up on df.usuarioProductoUsuarioProductoId = up.usuario_producto_id
                            join producto p on up.productoProductoId = p.producto_id
                            join unidad u on up.unidadUnidadId = u.unidad_id
                            join usuario pr on up.usuarioUsuarioId = pr.usuario_id;`)
    }

    editarUno(facturaEditada: FacturaEntity) {
        return this.repositorio.save(facturaEditada)
    }

    eliminarUno(id: number) {
        return this.repositorio.delete(id)
    }


}
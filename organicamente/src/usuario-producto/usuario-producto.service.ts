import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Like, Repository} from "typeorm/index";
import {UsuarioProductoEntity} from "./usuario-producto.entity";
import {FindManyOptions, getManager} from "typeorm";
import {UsuarioEntity} from "../usuario/usuario.entity";


@Injectable()
export class UsuarioProductoService {

    constructor( //Inyeccion de dependencias
        @InjectRepository(UsuarioProductoEntity)
        private repositorio: Repository<UsuarioProductoEntity>
    ) {
    }


    crearUno(usuarioProducto: UsuarioProductoEntity) {
        return this.repositorio.save(usuarioProducto) // promesa
    }

    buscarTodos() {
        return this.repositorio.find({relations: ['producto', 'unidad', 'usuario']})
    }

    buscarUno(id: number) {
        return this.repositorio.findOne(id, {relations: ['producto', 'unidad', 'usuario']})
    }

    buscarEspecificosProductor(id: number) {
        let busquedaEjemplo: FindManyOptions<UsuarioProductoEntity>

        busquedaEjemplo = {
            where: [
                {
                    usuario: id,
                }
            ],
            relations: ['producto', 'unidad', 'usuario']
        }

        return this.repositorio.find(busquedaEjemplo)
    }

    async busquedaProductoCamposCliente(busqueda: string) {
        return await getManager('default')
            .query(`select us.nombre as 'nombre', us.apellido as 'apellido', us.username as 'username',  up.stock as 'stock', 
                            up.precio as 'precio', u.nombre as 'unidad', p.nombre as 'producto', up.imagen as 'imagen', up.usuario_producto_id as 'usuarioProductoId', us.usuario_id as 'usuarioId' 
                            from usuario_producto up 
                            join producto p on up.productoProductoId = p.producto_id 
                            join unidad u on up.unidadUnidadId = u.unidad_id 
                            join usuario us on up.usuarioUsuarioId = us.usuario_id 
                            where u.nombre LIKE '%${busqueda}%' or p.nombre LIKE '%${busqueda}%' or us.nombre LIKE '%${busqueda}%' or us.apellido LIKE '%${busqueda}%';`)

    }


    async busquedaProductoCamposProductor(busqueda: string, id: number) {
        return await getManager('default')
            .query(`select us.nombre as 'nombre', us.apellido as 'apellido', us.username as 'username',  up.stock as 'stock', 
                            up.precio as 'precio', u.nombre as 'unidad', p.nombre as 'producto', up.imagen as 'imagen', up.usuario_producto_id as 'usuarioProductoId', us.usuario_id as 'usuarioId'  
                            from usuario_producto up 
                            join producto p on up.productoProductoId = p.producto_id 
                            join unidad u on up.unidadUnidadId = u.unidad_id 
                            join usuario us on up.usuarioUsuarioId = us.usuario_id and up.usuarioUsuarioId = ${id}
                            where u.nombre LIKE '%${busqueda}%' or p.nombre LIKE '%${busqueda}%' or us.nombre LIKE '%${busqueda}%' or us.apellido LIKE '%${busqueda}%';`)

    }

    editarUno(usuarioProductoEditado: UsuarioProductoEntity) {
        return this.repositorio.save(usuarioProductoEditado)
    }

    eliminarUno(id: number) {
        return this.repositorio.delete(id)
    }


}
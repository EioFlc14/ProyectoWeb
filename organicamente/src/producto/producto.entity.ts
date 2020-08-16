import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";
import {OneToMany} from "typeorm/index";
import {UsuarioProductoEntity} from "../usuario-producto/usuario-producto.entity";

//*****INCLUIR EL INDEX


@Entity('producto')
export class ProductoEntity{

    @PrimaryGeneratedColumn({
        name: 'producto_id',
        unsigned: true,
    })
    productoId:number

    @Column({
        name: 'nombre',
        type: "varchar",
        length: '100',
        nullable: false,
    })
    nombre:string


    // RELACIONES

    //producto - usuario_producto

    @OneToMany(
        type => UsuarioProductoEntity,
        usuarioProducto => usuarioProducto.producto
    )
    usuarioProductos: UsuarioProductoEntity[]


}
import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";
import {ManyToOne, OneToMany} from "typeorm/index";
import {ProductoEntity} from "../producto/producto.entity";
import {type} from "os";
import {UnidadEntity} from "../unidad/unidad.entity";
import {ImagenEntity} from "../imagen/imagen.entity";
import {DetalleFacturaEntity} from "../detalle-factura/detalle-factura.entity";
import {UsuarioEntity} from "../usuario/usuario.entity";
import {FacturaEntity} from "../factura/factura.entity";

//*****INCLUIR EL INDEX


@Entity('usuario_producto')
export class UsuarioProductoEntity {

    @PrimaryGeneratedColumn({
        name: 'usuario_producto_id',
        unsigned: true,
    })
    usuarioProductoId: number

    @Column({
        name: 'stock',
        type: 'int',
        nullable: false,
    })
    stock: number

    @Column({
        name: 'precio',
        type: "decimal",
        precision: 5, // enteros
        scale: 3, // decimales
        nullable: false,
    })
    precio: number

    // ****************REVISAR LAS RELACIONES DE AQUÍIIIIIIIIIIIIIIIIIIII POR QUE SE ESTÁN METIENDO MAL

    // RELACIONES

    // usuario-producto - producto
    @ManyToOne(
        type => ProductoEntity,
        producto => producto.usuarioProductos
    )
    producto: ProductoEntity


    // usuario-producto - unidad
    @ManyToOne(
        type => UnidadEntity,
        unidad => unidad.usuarioProductos,
    )
    unidad: UnidadEntity


    // usuario-producto - imagen
    @OneToMany(
        type => ImagenEntity,
        imagen => imagen.usuarioProducto,
    )
    imagenes: ImagenEntity[]


    // usuario-producto - detalle-factura
    @OneToMany(
        type => DetalleFacturaEntity,
        detalle_factura => detalle_factura.usuarioProducto,
    )
    detallesFacturas: DetalleFacturaEntity[]


    // usuario.producto - usuario
    @ManyToOne(
        type => UsuarioEntity,
        usuario => usuario.usuariosProductos
    )
    usuario: UsuarioEntity


    // LAS NOMBRES DE ESTOS ATRIBUTOS DEBEN ESTAR IGUAL QUE EL NAME DEL TAG HTML QUE LE MANDA

}
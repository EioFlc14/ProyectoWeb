import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";
import {ManyToOne} from "typeorm/index";
import {type} from "os";
import {UsuarioProductoEntity} from "../usuario-producto/usuario-producto.entity";
import {FacturaEntity} from "../factura/factura.entity";

//*****INCLUIR EL INDEX


@Entity('detalle_factura')
export class DetalleFacturaEntity{

    @PrimaryGeneratedColumn({
        name: 'detalle_factura_id',
        unsigned: true,
    })
    detalleFacturaId:number

    @Column({
        name: 'cantidad',
        type: 'int',
        nullable: false,
    })
    cantidad:number

    @Column({
        name: 'precio',
        type: "decimal",
        precision: 6, // enteros
        scale: 3, // decimales
        nullable: false,
    })
    precio:number

    @Column({
        name: 'valor',
        type: "decimal",
        precision: 8, // enteros
        scale: 3, // decimales
        nullable: false,
    })
    valor:number



    // RELACIONES


    // detalle-factura - usuario-producto
    @ManyToOne(
        type => UsuarioProductoEntity,
        usuarioProducto => usuarioProducto.detallesFacturas
    )
    usuarioProducto: UsuarioProductoEntity


    // detalle-factura - factura
    @ManyToOne(
        type => FacturaEntity,
        factura => factura.detallesFacturas
    )
    factura: FacturaEntity

}
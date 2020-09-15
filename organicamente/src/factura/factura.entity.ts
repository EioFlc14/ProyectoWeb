import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";
import {ManyToOne, OneToMany} from "typeorm/index";
import {DetalleFacturaEntity} from "../detalle-factura/detalle-factura.entity";
import {UsuarioEntity} from "../usuario/usuario.entity";

//*****INCLUIR EL INDEX


@Entity('factura')
export class FacturaEntity{

    @PrimaryGeneratedColumn({
        name: 'factura_id',
        unsigned: true,
    })
    facturaId:number

    @Column({
        name: 'total',
        type: "decimal",
        precision: 10, // enteros
        scale: 3, // decimales
        nullable: false,
    })
    total:string

    @Column({
        name: 'fecha',
        type: "datetime",
        nullable: true,
    })
    fecha: string


    @Column({
        name: 'cumplido',
        type: "varchar",
        length: '5',
        nullable: false,
    })
    cumplido:string


    // RELACIONES


    // factura - detalle-factura
    @OneToMany(
        type => DetalleFacturaEntity,
        detalleFactura => detalleFactura.factura
    )
    detallesFacturas: DetalleFacturaEntity[]


    // factura - usuario
    @ManyToOne(
        type => UsuarioEntity,
        usuario => usuario.facturas
    )
    usuario:UsuarioEntity

}
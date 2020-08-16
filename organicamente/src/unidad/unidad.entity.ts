import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";
import {OneToMany} from "typeorm/index";
import {UsuarioProductoEntity} from "../usuario-producto/usuario-producto.entity";

//*****INCLUIR EL INDEX


@Entity('unidad')
export class UnidadEntity{

    @PrimaryGeneratedColumn({
        name: 'unidad_id',
        unsigned: true,
    })
    unidadId:number

    @Column({
        name: 'nombre',
        type: "varchar",
        length: '30',
        nullable: false,
    })
    nombre:string


    // RELACIONES

    @OneToMany(
        type => UsuarioProductoEntity,
        usuarioProducto => usuarioProducto.unidad
    )
    usuarioProductos: UsuarioProductoEntity[]





}
import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";
import {ManyToOne} from "typeorm/index";
import {UsuarioProductoEntity} from "../usuario-producto/usuario-producto.entity";

//*****INCLUIR EL INDEX


@Entity('imagen')
export class ImagenEntity{

    @PrimaryGeneratedColumn({
        name: 'imagen_id',
        unsigned: true,
    })
    imagenId:number

    @Column({
        name: 'imagen',
        type: "longblob",
        nullable: false,
    })
    imagen:string


    // RELACIONES
    @ManyToOne(
        type => UsuarioProductoEntity,
            usuarioProducto => usuarioProducto.imagenes
    )
    usuarioProducto:UsuarioProductoEntity


}
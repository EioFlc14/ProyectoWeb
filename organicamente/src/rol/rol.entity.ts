import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";
import {OneToMany} from "typeorm/index";
import {UsuarioRolEntity} from "../usuario-rol/usuario-rol.entity";

//*****INCLUIR EL INDEX


@Entity('rol')
export class RolEntity{

    @PrimaryGeneratedColumn({
        name: 'rol_id',
        unsigned: true,
    })
    rolId:number

    @Column({
        name: 'nombre',
        type: "varchar",
        length: '100',
        nullable: false,
    })
    nombre:string


    // RELACIONES


    // rol - usuario-rol
    @OneToMany(
        type => UsuarioRolEntity,
        usuarioRol => usuarioRol.rol
    )
    usuariosRoles: UsuarioRolEntity[]


}
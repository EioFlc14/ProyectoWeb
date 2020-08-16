import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";
import {ManyToOne} from "typeorm/index";
import {UsuarioEntity} from "../usuario/usuario.entity";
import {RolEntity} from "../rol/rol.entity";

//*****INCLUIR EL INDEX


@Entity('usuario_rol')
export class UsuarioRolEntity{

    @PrimaryGeneratedColumn({
        name: 'usuario_rol_id',
        unsigned: true,
    })
    usuarioRolId:number


    // RELACIONES


    // usuario-rol - usuario
    @ManyToOne(
        type => UsuarioEntity,
        usuario => usuario.usuariosRoles
    )
    usuario:UsuarioEntity


    // usuario-rol - roles
    @ManyToOne(
        type => RolEntity,
        rol => rol.usuariosRoles
    )
    rol:RolEntity


}
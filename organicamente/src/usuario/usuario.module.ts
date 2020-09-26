import {Module} from "@nestjs/common";
import {UsuarioController} from "./usuario.controller";
import {UsuarioService} from "./usuario.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {UsuarioEntity} from "./usuario.entity";
import {RolService} from "../rol/rol.service";
import {RolEntity} from "../rol/rol.entity";
import {UsuarioRolService} from "../usuario-rol/usuario-rol.service";
import {UsuarioRolEntity} from "../usuario-rol/usuario-rol.entity";


@Module({
    imports: [
        TypeOrmModule.forFeature([UsuarioEntity, RolEntity, UsuarioRolEntity], 'default')
    ],
    controllers:[
        UsuarioController
    ],
    providers: [
        UsuarioService,
        RolService,
        UsuarioRolService,
    ]
})

export class UsuarioModule{

}
import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {UsuarioRolEntity} from "./usuario-rol.entity";
import {UsuarioRolController} from "./usuario-rol.controller";
import {UsuarioRolService} from "./usuario-rol.service";
import {UsuarioEntity} from "../usuario/usuario.entity";
import {RolEntity} from "../rol/rol.entity";
import {UsuarioService} from "../usuario/usuario.service";
import {RolService} from "../rol/rol.service";


@Module({
    imports: [
        TypeOrmModule.forFeature([UsuarioRolEntity, UsuarioEntity, RolEntity], 'default')
    ],
    controllers: [
        UsuarioRolController,
    ],
    providers: [
        UsuarioRolService,
        UsuarioService,
        RolService,
    ]
})

export class UsuarioRolModule{

}
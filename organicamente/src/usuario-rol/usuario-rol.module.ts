import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {UsuarioRolEntity} from "./usuario-rol.entity";
import {UsuarioRolController} from "./usuario-rol.controller";
import {UsuarioRolService} from "./usuario-rol.service";


@Module({
    imports: [
        TypeOrmModule.forFeature([UsuarioRolEntity], 'default')
    ],
    controllers: [
        UsuarioRolController,
    ],
    providers: [
        UsuarioRolService,
    ]
})

export class UsuarioRolModule{

}
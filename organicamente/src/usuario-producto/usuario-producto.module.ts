import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {UsuarioProductoEntity} from "./usuario-producto.entity";
import {UsuarioProductoController} from "./usuario-producto.controller";
import {UsuarioProductoService} from "./usuario-producto.service";


@Module({
    imports: [
        TypeOrmModule.forFeature([UsuarioProductoEntity], 'default')
    ],
    controllers: [
        UsuarioProductoController,
    ],
    providers: [
        UsuarioProductoService,
    ]
})

export class UsuarioProductoModule{

}
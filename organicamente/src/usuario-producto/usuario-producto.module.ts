import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {UsuarioProductoEntity} from "./usuario-producto.entity";
import {UsuarioProductoController} from "./usuario-producto.controller";
import {UsuarioProductoService} from "./usuario-producto.service";
import { MulterModule } from '@nestjs/platform-express';

@Module({
    imports: [
        TypeOrmModule.forFeature([UsuarioProductoEntity], 'default'),
        MulterModule.register({
            dest: 'publico/imagenes',
        })
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
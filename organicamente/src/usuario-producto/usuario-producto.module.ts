import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {UsuarioProductoEntity} from "./usuario-producto.entity";
import {UsuarioProductoController} from "./usuario-producto.controller";
import {UsuarioProductoService} from "./usuario-producto.service";
import { MulterModule } from '@nestjs/platform-express';
import {ProductoService} from "../producto/producto.service";
import {UnidadService} from "../unidad/unidad.service";
import {ProductoEntity} from "../producto/producto.entity";
import {UnidadEntity} from "../unidad/unidad.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([UsuarioProductoEntity, ProductoEntity, UnidadEntity], 'default'),
        MulterModule.register({
            dest: 'publico/imagenes',
        }),

    ],
    controllers: [
        UsuarioProductoController,
    ],
    providers: [
        UsuarioProductoService,
        ProductoService,
        UnidadService,
    ]
})

export class UsuarioProductoModule{

}
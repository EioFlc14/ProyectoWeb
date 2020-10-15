import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {ProductoEntity} from "./producto.entity";
import {ProductoController} from "./producto.controller";
import {ProductoService} from "./producto.service";


@Module({
    imports: [
        TypeOrmModule.forFeature([ProductoEntity], 'default')
    ],
    controllers: [
        ProductoController,
    ],
    providers: [
        ProductoService,
    ]
})

export class ProductoModule {

}
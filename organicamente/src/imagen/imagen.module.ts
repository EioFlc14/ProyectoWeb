import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {ImagenEntity} from "./imagen.entity";
import {ImagenController} from "./imagen.controller";
import {ImagenService} from "./imagen.service";


@Module({
    imports: [
        TypeOrmModule.forFeature([ImagenEntity], 'default')
    ],
    controllers: [
        ImagenController,
    ],
    providers: [
        ImagenService,
    ]
})

export class ImagenModule{

}
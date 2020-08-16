import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {UnidadEntity} from "./unidad.entity";
import {UnidadController} from "./unidad.controller";
import {UnidadService} from "./unidad.service";


@Module({
    imports: [
        TypeOrmModule.forFeature([UnidadEntity], 'default')
    ],
    controllers: [
        UnidadController,
    ],
    providers: [
        UnidadService,
    ]
})

export class UnidadModule{

}
import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {DetalleFacturaEntity} from "./detalle-factura.entity";
import {DetalleFacturaController} from "./detalle-factura.controller";
import {DetalleFacturaService} from "./detalle-factura.service";


@Module({
    imports: [
        TypeOrmModule.forFeature([DetalleFacturaEntity], 'default')
    ],
    controllers: [
        DetalleFacturaController,
    ],
    providers: [
        DetalleFacturaService,
    ]
})

export class DetalleFacturaModule{

}
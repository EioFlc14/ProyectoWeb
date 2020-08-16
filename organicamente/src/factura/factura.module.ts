import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {FacturaEntity} from "./factura.entity";
import {FacturaController} from "./factura.controller";
import {FacturaService} from "./factura.service";


@Module({
    imports: [
        TypeOrmModule.forFeature([FacturaEntity], 'default')
    ],
    controllers: [
        FacturaController,
    ],
    providers: [
        FacturaService,
    ]
})

export class FacturaModule {

}
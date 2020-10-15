import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {FacturaEntity} from "./factura.entity";
import {FacturaController} from "./factura.controller";
import {FacturaService} from "./factura.service";
import {UsuarioProductoEntity} from "../usuario-producto/usuario-producto.entity";
import {UsuarioProductoService} from "../usuario-producto/usuario-producto.service";
import {DetalleFacturaEntity} from "../detalle-factura/detalle-factura.entity";
import {DetalleFacturaService} from "../detalle-factura/detalle-factura.service";


@Module({
    imports: [
        TypeOrmModule.forFeature([FacturaEntity, UsuarioProductoEntity, DetalleFacturaEntity], 'default')
    ],
    controllers: [
        FacturaController,
    ],
    providers: [
        FacturaService,
        UsuarioProductoService,
        DetalleFacturaService,
    ]
})

export class FacturaModule {

}
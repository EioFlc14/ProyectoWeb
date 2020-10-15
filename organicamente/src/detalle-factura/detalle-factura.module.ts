import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {DetalleFacturaEntity} from "./detalle-factura.entity";
import {DetalleFacturaController} from "./detalle-factura.controller";
import {DetalleFacturaService} from "./detalle-factura.service";
import {UsuarioService} from "../usuario/usuario.service";
import {UsuarioEntity} from "../usuario/usuario.entity";


@Module({
    imports: [
        TypeOrmModule.forFeature([DetalleFacturaEntity,UsuarioEntity], 'default')
    ],
    controllers: [
        DetalleFacturaController,
    ],
    providers: [
        DetalleFacturaService,
        UsuarioService
    ]
})

export class DetalleFacturaModule{

}
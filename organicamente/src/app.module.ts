import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {DetalleFacturaModule} from "./detalle-factura/detalle-factura.module";
import {FacturaModule} from "./factura/factura.module";
import {ImagenModule} from "./imagen/imagen.module";
import {ProductoModule} from "./producto/producto.module";
import {RolModule} from "./rol/rol.module";
import {UnidadModule} from "./unidad/unidad.module";
import {UsuarioModule} from "./usuario/usuario,module";
import {UsuarioProductoModule} from "./usuario-producto/usuario-producto.module";
import {UsuarioRolModule} from "./usuario-rol/usuario-rol.module";
import {TypeOrmModule} from "@nestjs/typeorm";
import {DetalleFacturaEntity} from "./detalle-factura/detalle-factura.entity";
import {FacturaEntity} from "./factura/factura.entity";
import {ImagenEntity} from "./imagen/imagen.entity";
import {ProductoEntity} from "./producto/producto.entity";
import {RolEntity} from "./rol/rol.entity";
import {UnidadEntity} from "./unidad/unidad.entity";
import {UsuarioEntity} from "./usuario/usuario.entity";
import {UsuarioProductoEntity} from "./usuario-producto/usuario-producto.entity";
import {UsuarioRolEntity} from "./usuario-rol/usuario-rol.entity";

@Module({
  imports: [
      DetalleFacturaModule,
      FacturaModule,
      ImagenModule,
      ProductoModule,
      RolModule,
      UnidadModule,
      UsuarioModule,
      UsuarioProductoModule,
      UsuarioRolModule,
      TypeOrmModule.forRoot({
        name: 'default',
        type: 'mysql',
        host: 'localhost',
        port: 3306,
        username: 'root',
        password: 'root',
        database: 'organicamente',
        entities: [
            DetalleFacturaEntity,
            FacturaEntity,
            ImagenEntity,
            ProductoEntity,
            RolEntity,
            UnidadEntity,
            UsuarioEntity,
            UsuarioProductoEntity,
            UsuarioRolEntity,
        ],
        synchronize: true,
        dropSchema: false


      })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

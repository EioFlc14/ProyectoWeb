import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {RolEntity} from "./rol.entity";
import {RolController} from "./rol.controller";
import {RolService} from "./rol.service";


@Module({
    imports: [
        TypeOrmModule.forFeature([RolEntity], 'default')
    ],
    controllers: [
        RolController,
    ],
    providers: [
        RolService,
    ]
})

export class RolModule{

}
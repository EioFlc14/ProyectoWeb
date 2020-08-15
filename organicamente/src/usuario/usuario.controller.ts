import {
    BadRequestException,
    Controller,
    Delete,
    Get,
    InternalServerErrorException, NotFoundException,
    Param,
    Post,
    Put
} from "@nestjs/common";
import {UsuarioService} from "./usuario.service";


@Controller('usuario')
export class UsuarioController{

    constructor(
        private readonly _usuarioService: UsuarioService
    ) {
    }

    @Get()
    async verTodos(){
        try {
            const respuesta = await this._usuarioService.buscarTodos()
            return respuesta
        } catch(e){
            console.error(e)
            throw new InternalServerErrorException({
                mensaje: 'Error del servicio',
            })
        }
    }

    @Get(':id')
    async verUno(
        @Param() paramRuta
    ){
        let respuesta
        try{
            respuesta = await this._usuarioService.buscarUno(Number(paramRuta.id))
        } catch (e){
            console.error(e)
            throw new BadRequestException({
                mensaje: 'Error validando datos'
            })
        }

        if(respuesta){
            return respuesta
        } else {
            throw  new NotFoundException({
                mensaje: 'No existen registros'
            })
        }

    }



    //@Post()


    //@Put()


    //@Delete()






}
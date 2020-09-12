import {
    Body,
    Controller,
    Get,
    InternalServerErrorException,
    NotFoundException,
    Param,
    Post,
    Query,
    Res
} from "@nestjs/common";
import {UnidadService} from "../unidad/unidad.service";
import {UnidadCreateDto} from "../unidad/dto/unidad.create-dto";
import {validate, ValidationError} from "class-validator";
import {UsuarioRolService} from "./usuario-rol.service";
import {UsuarioRolCreateDto} from "./dto/usuario-rol.create-dto";

@Controller('usuario-rol')
export class UsuarioRolController{

    constructor(
        private readonly _usuarioRolService: UsuarioRolService
    ) {
    }

    @Get('vista/inicio') // poner la direccion que corresponda
    async obtenerUsuariosRoles(
        @Res() res
    ) {
        let resultadoEncontrado
        try {
            resultadoEncontrado = await this._usuarioRolService.buscarTodos()
        } catch(error){
            throw new InternalServerErrorException('Error encontrando usuarios roles')
        }

        if(resultadoEncontrado){
            console.log(resultadoEncontrado)
            return res.render('usuario-rol/inicio', {arregloUsuariosRoles: resultadoEncontrado}) // con esto mando resultadoEcontrado hasta usuario/inicio
        } else {
            throw new NotFoundException('NO se encontraron usuarios roles')
        }
    }

    @Get('vista/crear')
    crearUsuariosRolesVista(
        @Query() parametrosConsulta,
        @Res() res
    ){
        return res.render('usuario-rol/crear',
            {
                error: parametrosConsulta.error,
                usuario: parametrosConsulta.usuario,
                rol: parametrosConsulta.rol
            })
    }

    //@Post()
    @Post('crearDesdeVista')
    async crearDesdeVista(
        @Body() paramBody,
        @Res() res,
    ){
        let respuestaCreacionUsuarioRol
        const usuarioRolCreado = new UsuarioRolCreateDto()
        usuarioRolCreado.usuarioId = paramBody.usuario
        usuarioRolCreado.rolId = paramBody.rol

        const errores: ValidationError[] = await validate(usuarioRolCreado)
        const texto = `&usuario=${paramBody.usuario}&rol=${paramBody.rol}`
        if(errores.length > 0){
            console.error('Errores:',errores);
            const error = 'Error en el formato de los datos'
            return res.redirect('/usuario-rol/vista/crear?error='+error+texto)
        } else {
            try {
                respuestaCreacionUsuarioRol = await this._usuarioRolService.crearUno(paramBody)
            } catch (e){
                console.error(e)
                const errorCreacion = 'Error al crear el Usuaro Rol'
                return res.redirect('/usuario-rol/vista/crear?error='+errorCreacion+texto)
            }

            if(respuestaCreacionUsuarioRol){
                return res.redirect('/usuario-rol/vista/inicio') // en caso de que all esté OK se envía al inicio
            } else {
                const errorCreacion = 'Error al crear el Usuario Rol'
                return res.redirect('/usuario-rol/vista/crear?error='+errorCreacion+texto)
            }
        }

    }


    @Post('eliminarDesdeVista/:id')
    async eliminarDesdeVista(
        @Param() paramRuta,
        @Res() res,
    ){
        try{
            await this._usuarioRolService.eliminarUno(Number(paramRuta.id))
            return res.redirect('/usuario-rol/vista/inicio?mensaje= Usuario Rol Eliminado')
        } catch(error){
            console.error(error)
            return res.redirect('/usuario-rol/vista/inicio?error=Error eliminando usuario rol')
        }
    }

}
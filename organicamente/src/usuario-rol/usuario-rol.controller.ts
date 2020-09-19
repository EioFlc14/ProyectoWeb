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
import {validate, ValidationError} from "class-validator";
import {UsuarioRolService} from "./usuario-rol.service";
import {UsuarioRolCreateDto} from "./dto/usuario-rol.create-dto";
import {UsuarioService} from "../usuario/usuario.service";
import {RolService} from "../rol/rol.service";

@Controller('usuario-rol')
export class UsuarioRolController{

    constructor(
        private readonly _usuarioRolService: UsuarioRolService,
        private readonly _usuarioService: UsuarioService,
        private readonly _rolService: RolService,
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
    async crearUsuariosRolesVista(
        @Query() parametrosConsulta,
        @Res() res
    ){

        let arregloUsuarios
        let arregloRoles

        try {
            arregloUsuarios = await this._usuarioService.buscarTodos()
            arregloRoles = await this._rolService.buscarTodos()

        } catch {
            throw new InternalServerErrorException('Error obteniendo los datos. ')
        }

        if(arregloRoles && arregloUsuarios){
            return res.render('usuario-rol/crear',
                {
                    error: parametrosConsulta.error,
                    usuario: parametrosConsulta.usuario,
                    rol: parametrosConsulta.rol,
                    arregloRoles: arregloRoles,
                    arregloUsuarios:  arregloUsuarios,
                })
        } else {
            throw new InternalServerErrorException('No hay suficientes datos para realizar su acción. Inténtelo más tarde.')
        }
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
                return res.redirect('/usuario-rol/vista/inicio?mensaje=Creado exitosamente') // en caso de que all esté OK se envía al inicio
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
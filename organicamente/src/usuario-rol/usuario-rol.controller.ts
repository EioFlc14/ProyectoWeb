import {
    Body,
    Controller,
    Get,
    InternalServerErrorException,
    Post,
    Query,
    Res, Session
} from "@nestjs/common";
import {validate, ValidationError} from "class-validator";
import {UsuarioRolService} from "./usuario-rol.service";
import {UsuarioRolCreateDto} from "./dto/usuario-rol.create-dto";
import {UsuarioService} from "../usuario/usuario.service";
import {RolService} from "../rol/rol.service";

@Controller('usuario-rol')
export class UsuarioRolController {

    constructor(
        private readonly _usuarioRolService: UsuarioRolService,
        private readonly _usuarioService: UsuarioService,
        private readonly _rolService: RolService,
    ) {
    }

    @Get('vista/inicio')
    async obtenerUsuariosRoles(
        @Res() res,
        @Session() session,
    ) {
        if (session.usuarioId) {
            let resultadoEncontrado
            try {
                resultadoEncontrado = await this._usuarioRolService.buscarTodos()
            } catch (error) {
                throw new InternalServerErrorException('Error encontrando usuarios roles')
            }

            if (resultadoEncontrado) {

                const esAdministrador = session.roles.some((rol) => rol == 'administrador')
                const esProductor = session.roles.some((rol) => rol == 'productor')
                const esCliente = session.roles.some((rol) => rol == 'cliente')

                console.log(resultadoEncontrado)
                return res.render('usuario-rol/inicio',
                    {
                        arregloUsuariosRoles: resultadoEncontrado,
                        id: session.usuarioId,
                        esAdministrador:esAdministrador,
                        esProductor: esProductor,
                        esCliente: esCliente,
                    })
            } else {
                const error = 'No hay suficientes datos para esta acción. Inténtelo más tarde.'
                return res.redirect('/principal?error=' + error)
            }

        } else {
            return res.redirect('/login')
        }
    }

    @Get('vista/crear')
    async crearUsuariosRolesVista(
        @Query() parametrosConsulta,
        @Res() res,
        @Session() session,
    ) {

        if (session.usuarioId) {
            let arregloUsuarios
            let arregloRoles

            try {
                const busqueda = '' // esto se por la barra de busqueda, aqui no se necesita entonces se deja vacio y va a retornar todos los usuarios
                arregloUsuarios = await this._usuarioService.buscarTodos(busqueda)
                arregloRoles = await this._rolService.buscarTodos()

            } catch {
                const error = 'No hay suficientes datos para esta acción. Inténtelo más tarde.'
                return res.redirect('/principal?error=' + error)
            }

            if (arregloRoles && arregloUsuarios) {

                const esAdministrador = session.roles.some((rol) => rol == 'administrador')
                const esProductor = session.roles.some((rol) => rol == 'productor')
                const esCliente = session.roles.some((rol) => rol == 'cliente')

                return res.render('usuario-rol/crear',
                    {
                        error: parametrosConsulta.error,
                        usuario: parametrosConsulta.usuario,
                        rol: parametrosConsulta.rol,
                        arregloRoles: arregloRoles,
                        arregloUsuarios: arregloUsuarios,
                        id: session.usuarioId,
                        esAdministrador:esAdministrador,
                        esProductor: esProductor,
                        esCliente: esCliente,
                    })
            } else {
                const error = 'No hay suficientes datos para esta acción. Inténtelo más tarde.'
                return res.redirect('/principal?error=' + error)
            }

        } else {
            return res.redirect('/login')
        }
    }


    @Post('crearDesdeVista')
    async crearDesdeVista(
        @Body() paramBody,
        @Res() res,
        @Session() session,
    ) {
        if (session.usuarioId) {
            let respuestaCreacionUsuarioRol
            const usuarioRolCreado = new UsuarioRolCreateDto()
            usuarioRolCreado.usuarioId = paramBody.usuario
            usuarioRolCreado.rolId = paramBody.rol

            const errores: ValidationError[] = await validate(usuarioRolCreado)
            const texto = `&usuario=${paramBody.usuario}&rol=${paramBody.rol}`
            if (errores.length > 0) {
                const error = 'Error en el formato de los datos'
                return res.redirect('/usuario-rol/vista/crear?error=' + error + texto)
            } else {
                try {
                    respuestaCreacionUsuarioRol = await this._usuarioRolService.crearUno(paramBody)
                } catch (e) {
                    console.error(e)
                    const errorCreacion = 'Error al crear el Usuaro Rol'
                    return res.redirect('/usuario-rol/vista/crear?error=' + errorCreacion + texto)
                }

                if (respuestaCreacionUsuarioRol) {
                    return res.redirect('/usuario-rol/vista/inicio?mensaje=Creado exitosamente') // en caso de que all esté OK se envía al inicio
                } else {
                    const errorCreacion = 'Error al crear el Usuario Rol'
                    return res.redirect('/usuario-rol/vista/crear?error=' + errorCreacion + texto)
                }
            }
        } else {
            return res.redirect('/login')
        }
    }


/*    @Post('eliminarDesdeVista/:id')
    async eliminarDesdeVista(
        @Param() paramRuta,
        @Res() res,
        @Session() session,
    ) {
        if (session.usuarioId) {
            try {
                await this._usuarioRolService.eliminarUno(Number(paramRuta.id))
                return res.redirect('/usuario-rol/vista/inicio?mensaje= Usuario Rol Eliminado')
            } catch (error) {
                console.error(error)
                return res.redirect('/usuario-rol/vista/inicio?error=Error eliminando usuario rol')
            }

        } else {
            return res.redirect('login')
        }
    }*/

}
import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    Query, Res, Session
} from "@nestjs/common";
import {UsuarioService} from "./usuario.service";
import {UsuarioCreateDto} from "./dto/usuario.create-dto";
import {validate, ValidationError} from "class-validator";
import {UsuarioUpdateDto} from "./dto/usuario.update-dto";
import {UsuarioEntity} from "./usuario.entity";
import {UsuarioRolEntity} from "../usuario-rol/usuario-rol.entity";
import {RolService} from "../rol/rol.service";
import {UsuarioRolService} from "../usuario-rol/usuario-rol.service";
import {ContrasenaUpdateDto} from "./dto/contrasena.update-dto";


@Controller('usuario')
export class UsuarioController {

    constructor(
        private readonly _usuarioService: UsuarioService,
        private readonly _rolService: RolService,
        private readonly _usuarioRolService: UsuarioRolService,
    ) {
    }


    @Get('vista/inicio')
    async obtenerUsuarios(
        @Res() res,
        @Query() parametrosConsulta,
        @Session() session,
    ) {
        if (session.usuarioId) {
            let resultadoEncontrado
            let error
            try {
                if (parametrosConsulta.busqueda == undefined) {
                    parametrosConsulta.busqueda = ''
                }
                resultadoEncontrado = await this._usuarioService.buscarTodos(parametrosConsulta.busqueda)
            } catch (error) {
                error = 'Error encontrando usuarios.'
                return res.redirect('/principal?error=' + error)
            }

            const esAdministrador = session.roles.some((rol) => rol == 'administrador')
            const esProductor = session.roles.some((rol) => rol == 'productor')
            const esCliente = session.roles.some((rol) => rol == 'cliente')

            if (resultadoEncontrado) {
                return res.render('usuario/inicio',
                    {
                        arregloUsuarios: resultadoEncontrado,
                        id: session.usuarioId,
                        esAdministrador:esAdministrador,
                        esProductor: esProductor,
                        esCliente: esCliente,
                    })
            } else {
                error = 'No se encontraron usuarios para mostrar.'
                return res.redirect('/principal?error=' + error)
            }

        } else {
            return res.redirect('/login')
        }
    }


    @Get('vista/crear')
    crearUsuarioVista(
        @Query() parametrosConsulta,
        @Res() res,
        @Session() session,
    ) {

        if (session.usuarioId) {
            const esAdministrador = session.roles.some((rol) => rol == 'administrador')
            const esProductor = session.roles.some((rol) => rol == 'productor')
            const esCliente = session.roles.some((rol) => rol == 'cliente')

            return res.render('usuario/crear',
                {
                    error: parametrosConsulta.error,
                    nombre: parametrosConsulta.nombre,
                    apellido: parametrosConsulta.apellido,
                    email: parametrosConsulta.email,
                    telefono: parametrosConsulta.telefono,
                    direccion: parametrosConsulta.direccion,
                    username: parametrosConsulta.username,
                    password: parametrosConsulta.password,
                    identificacion: parametrosConsulta.identificacion,
                    id: session.usuarioId,
                    esAdministrador:esAdministrador,
                    esProductor: esProductor,
                    esCliente: esCliente,
                })
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
            const usuarioValidado = new UsuarioCreateDto()
            usuarioValidado.nombre = paramBody.nombre
            usuarioValidado.apellido = paramBody.apellido
            usuarioValidado.email = paramBody.email
            usuarioValidado.telefono = paramBody.telefono
            usuarioValidado.direccion = paramBody.direccion
            usuarioValidado.username = paramBody.username
            usuarioValidado.password = paramBody.password
            usuarioValidado.identificacion = paramBody.identificacion


            const errores: ValidationError[] = await validate(usuarioValidado)
            const texto = `&nombre=${paramBody.nombre}&apellido=${paramBody.apellido}&email=${paramBody.email}&telefono=${paramBody.telefono}&direccion=${paramBody.direccion}&username=${paramBody.username}&identificacion=${paramBody.identificacion}`
            if (errores.length > 0) {
                const error = 'Error en el formato de los datos. Asegúrese de llenar los campos correctamente.'
                return res.redirect('/usuario/vista/crear?error=' + error + texto)
            } else {

                const re = /^[\p{L}'][ \p{L}'-]*[\p{L}]$/u;
                if (re.test(paramBody.nombre)) {

                    let respuestaCreacionUsuario

                    if (paramBody.password === paramBody.passwordConfirmada) {
                        if (paramBody.productor != undefined || paramBody.cliente != undefined || paramBody.administrador != undefined) {
                            const emailExistente = await this._usuarioService.emailRegistrado(paramBody.email)
                            if (emailExistente.length > 0) {
                                const errorCreacion = 'Correo ya registrado. Ingrese otro.'
                                return res.redirect('/usuario/vista/crear?error=' + errorCreacion + texto)
                            } else {
                                const usernameExistente = await this._usuarioService.usernameRegistrado(paramBody.username)

                                if (usernameExistente.length > 0) {
                                    const errorCreacion = 'Nombre de usuario ya registrado. Ingrese otro.'
                                    return res.redirect('/usuario/vista/crear?error=' + errorCreacion + texto)
                                } else {
                                    try {
                                        respuestaCreacionUsuario = await this._usuarioService.crearUno(paramBody)
                                    } catch (e) {
                                        console.error(e)
                                        const errorCreacion = 'Error al crear el Usuario. Inténtelo más tarde.'
                                        return res.redirect('/principal?error=' + errorCreacion)
                                    }

                                    let respuestaRoles

                                    if (respuestaCreacionUsuario) {

                                        let productorRol = true
                                        let clienteRol = true
                                        let administradorRol = true

                                        if (paramBody.productor != undefined) {
                                            productorRol = false
                                            let respuestaCreacionUsuarioRolProductor
                                            respuestaRoles = await this._rolService.buscarUnoNombre(paramBody.productor)

                                            const usuarioRol = {
                                                usuario: respuestaCreacionUsuario.usuarioId,
                                                rol: respuestaRoles.rolId
                                            } as unknown as UsuarioRolEntity

                                            respuestaCreacionUsuarioRolProductor = await this._usuarioRolService.crearUno(usuarioRol)
                                            if (respuestaCreacionUsuarioRolProductor) {
                                                productorRol = true
                                            } else {
                                                const errorCreacion = 'Error al crear el Usuario'
                                                return res.redirect('/principal?error=' + errorCreacion)
                                            }
                                        }

                                        if (paramBody.cliente != undefined) {
                                            clienteRol = false
                                            let respuestaCreacionUsuarioRolCliente
                                            respuestaRoles = await this._rolService.buscarUnoNombre(paramBody.cliente)

                                            const usuarioRol = {
                                                usuario: respuestaCreacionUsuario.usuarioId,
                                                rol: respuestaRoles.rolId
                                            } as unknown as UsuarioRolEntity

                                            respuestaCreacionUsuarioRolCliente = await this._usuarioRolService.crearUno(usuarioRol)
                                            if (respuestaCreacionUsuarioRolCliente) {
                                                clienteRol = true
                                            } else {
                                                const errorCreacion = 'Error al crear el Usuario'
                                                return res.redirect('/principal?error=' + errorCreacion)
                                            }
                                        }

                                        if (paramBody.administrador != undefined) {
                                            administradorRol = false
                                            let respuestaCreacionUsuarioRolAdministrador
                                            respuestaRoles = await this._rolService.buscarUnoNombre(paramBody.administrador)

                                            const usuarioRol = {
                                                usuario: respuestaCreacionUsuario.usuarioId,
                                                rol: respuestaRoles.rolId
                                            } as unknown as UsuarioRolEntity

                                            respuestaCreacionUsuarioRolAdministrador = await this._usuarioRolService.crearUno(usuarioRol)
                                            if (respuestaCreacionUsuarioRolAdministrador) {
                                                administradorRol = true
                                            } else {
                                                const errorCreacion = 'Error al crear el Usuario'
                                                return res.redirect('/principal?error=' + errorCreacion)
                                            }
                                        }

                                        if (clienteRol && productorRol && administradorRol) {
                                            const exito = 'Usuario creado correctamente'
                                            return res.redirect('/principal?exito=' + exito)
                                        } else {
                                            const errorCreacion = 'Error al crear el Usuario.'
                                            return res.redirect('/principal?error=' + errorCreacion)
                                        }                                            // en caso de que all esté OK se envía al inicio

                                    } else {
                                        const errorCreacion = 'Error al crear el Usuario'
                                        return res.redirect('/principal?error=' + errorCreacion)
                                    }
                                }

                            }
                        } else {
                            const errorCreacion = 'Debe seleccionar al menos un Rol.'
                            return res.redirect('/usuario/vista/crear?error=' + errorCreacion + texto)
                        }
                    } else {
                        const errorCreacion = 'Las contraseñas no coinciden. Deben ser las mismas.'
                        return res.redirect('/usuario/vista/crear?error=' + errorCreacion + texto)
                    }
                } else {
                    const error = 'Caracteres no permitidos.'
                    return res.redirect('/usuario/vista/crear?error=' + error)
                }
            }

        } else {
            return res.redirect('/login')
        }


    }


    @Get('vista/editar/:id')
    async editarUsuarioVista(
        @Query() parametrosConsulta,
        @Param() parametrosRuta,
        @Res() res,
        @Session() session,
    ) {

        if (session.usuarioId) {
            const id = Number(parametrosRuta.id)
            let usuarioEncontrado

            try {
                usuarioEncontrado = await this._usuarioService.buscarUno(id)

                if (usuarioEncontrado) {
                    let rolesEncontrados
                    let cliente
                    let productor
                    let administrador

                    rolesEncontrados = await this._usuarioRolService.buscarRolesUnUsuario(usuarioEncontrado.usuarioId)

                    rolesEncontrados.forEach((objeto) => {

                        if (objeto.rol.toLowerCase() === 'cliente') {
                            cliente = 'Cliente'
                        }
                        if (objeto.rol.toLowerCase() === 'productor') {
                            productor = 'Productor'
                        }
                        if (objeto.rol.toLowerCase() === 'administrador') {
                            administrador = 'Administrador'
                        }
                    })

                    const esAdministrador = session.roles.some((rol) => rol == 'administrador')
                    const esProductor = session.roles.some((rol) => rol == 'productor')
                    const esCliente = session.roles.some((rol) => rol == 'cliente')

                    return res.render(
                        'usuario/crear',
                        {
                            error: parametrosConsulta.error,
                            usuario: usuarioEncontrado,
                            cliente: cliente,
                            productor: productor,
                            administrador: administrador,
                            id: session.usuarioId,
                            esAdministrador:esAdministrador,
                            esProductor: esProductor,
                            esCliente: esCliente,
                        }
                    )

                } else {
                    return res.redirect('/usuario/vista/inicio?error=Usuario no encontrado')
                }

            } catch (error) {
                console.error('Error del servidor')
                return res.redirect('/usuario/vista/inicio?error=Error buscando usuario.....')
            }
        } else {
            return res.redirect('/login')
        }

    }


    @Get('vista/editar')
    async editarUsuarioVistaMiCuenta(
        @Query() parametrosConsulta,
        @Param() parametrosRuta,
        @Res() res,
        @Session() session,
    ) {

        if (session.usuarioId) {
            const id = session.usuarioId
            let usuarioEncontrado

            try {
                usuarioEncontrado = await this._usuarioService.buscarUno(id)

                if (usuarioEncontrado) {
                    let rolesEncontrados
                    let cliente
                    let productor
                    let administrador

                    rolesEncontrados = await this._usuarioRolService.buscarRolesUnUsuario(usuarioEncontrado.usuarioId)

                    rolesEncontrados.forEach((objeto) => {

                        if (objeto.rol.toLowerCase() === 'cliente') {
                            cliente = 'Cliente'
                        }
                        if (objeto.rol.toLowerCase() === 'productor') {
                            productor = 'Productor'
                        }
                        if (objeto.rol.toLowerCase() === 'administrador') {
                            administrador = 'Administrador'
                        }
                    })

                    const esAdministrador = session.roles.some((rol) => rol == 'administrador')
                    const esProductor = session.roles.some((rol) => rol == 'productor')
                    const esCliente = session.roles.some((rol) => rol == 'cliente')

                    return res.render(
                        'usuario/crear',
                        {
                            error: parametrosConsulta.error,
                            usuario: usuarioEncontrado,
                            cliente: cliente,
                            productor: productor,
                            administrador: administrador,
                            id: session.usuarioId,
                            esAdministrador:esAdministrador,
                            esProductor: esProductor,
                            esCliente: esCliente,
                        }
                    )

                } else {
                    return res.redirect('/usuario/vista/inicio?error=Usuario no encontrado')
                }

            } catch (error) {
                console.error('Error del servidor')
                return res.redirect('/usuario/vista/inicio?error=Error buscando usuario.....')
            }
        } else {
            return res.redirect('/login')
        }

    }



    @Post('editarDesdeVista/:id')
    async editarDesdeVista(
        @Param() parametrosRuta,
        @Body() paramBody,
        @Res() res,
        @Session() session,
    ) {
        if (session.usuarioId) {
            const id = Number(parametrosRuta.id)

            const usuarioValidado = new UsuarioUpdateDto()
            usuarioValidado.id = id
            usuarioValidado.nombre = paramBody.nombre
            usuarioValidado.apellido = paramBody.apellido
            usuarioValidado.telefono = paramBody.telefono
            usuarioValidado.direccion = paramBody.direccion

            const errores: ValidationError[] = await validate(usuarioValidado)
            if (errores.length > 0) {
                return res.redirect('/usuario/vista/editar/' + parametrosRuta.id + '?error=Error en el formato de los datos')
            } else {

                const re = /^[\p{L}'][ \p{L}'-]*[\p{L}]$/u;
                if (re.test(paramBody.nombre)) {

                    if (paramBody.productor != undefined || paramBody.cliente != undefined || paramBody.administrador != undefined) {

                        const eliminacionRoles = await this._usuarioRolService.eliminarUno(id)
                        if (eliminacionRoles) {
                            const usuarioEditado = {
                                usuarioId: id,
                                nombre: paramBody.nombre,
                                apellido: paramBody.apellido,
                                telefono: paramBody.telefono,
                                direccion: paramBody.direccion,
                            } as UsuarioEntity

                            try {
                                const respuestaUsuarioEditado = await this._usuarioService.editarUno(usuarioEditado)

                                if (respuestaUsuarioEditado) {
                                    let respuestaRoles
                                    let productorRol = true
                                    let clienteRol = true
                                    let administradorRol = true

                                    if (paramBody.productor != undefined) {
                                        productorRol = false
                                        respuestaRoles = await this._rolService.buscarUnoNombre(paramBody.productor)

                                        const usuarioRol = {
                                            usuario: id,
                                            rol: respuestaRoles.rolId
                                        } as unknown as UsuarioRolEntity

                                        const respuestaCreacionUsuarioRolProductor = await this._usuarioRolService.crearUno(usuarioRol)
                                        if (respuestaCreacionUsuarioRolProductor) {
                                            productorRol = true
                                        } else {
                                            const errorCreacion = 'Error al editar el Usuario'
                                            return res.redirect('/principal?error=' + errorCreacion)
                                        }
                                    }

                                    if (paramBody.cliente != undefined) {
                                        clienteRol = false
                                        let respuestaCreacionUsuarioRolCliente
                                        respuestaRoles = await this._rolService.buscarUnoNombre(paramBody.cliente)

                                        const usuarioRol = {
                                            usuario: id,
                                            rol: respuestaRoles.rolId
                                        } as unknown as UsuarioRolEntity

                                        respuestaCreacionUsuarioRolCliente = await this._usuarioRolService.crearUno(usuarioRol)
                                        if (respuestaCreacionUsuarioRolCliente) {
                                            clienteRol = true
                                        } else {
                                            const errorCreacion = 'Error al editar el Usuario'
                                            return res.redirect('/principal?error=' + errorCreacion)
                                        }
                                    }

                                    if (paramBody.administrador != undefined) {
                                        administradorRol = false
                                        let respuestaCreacionUsuarioRolAdministrador
                                        respuestaRoles = await this._rolService.buscarUnoNombre(paramBody.administrador)

                                        const usuarioRol = {
                                            usuario: id,
                                            rol: respuestaRoles.rolId
                                        } as unknown as UsuarioRolEntity

                                        respuestaCreacionUsuarioRolAdministrador = await this._usuarioRolService.crearUno(usuarioRol)
                                        if (respuestaCreacionUsuarioRolAdministrador) {
                                            administradorRol = true
                                        } else {
                                            const errorCreacion = 'Error al editar el Usuario'
                                            return res.redirect('/principal?error=' + errorCreacion)
                                        }
                                    }

                                    if (clienteRol && productorRol && administradorRol) {
                                        const exito = 'Usuario editado correctamente'
                                        return res.redirect('/principal?exito=' + exito)
                                    } else {
                                        const errorCreacion = 'Error al editar el Usuario.'
                                        return res.redirect('/principal?error=' + errorCreacion)
                                    }
                                } else {
                                    const errorCreacion = 'Error editando Usuario'
                                    return res.redirect('/principal?error=' + errorCreacion)
                                }

                            } catch (e) {
                                console.error(e)
                                const errorCreacion = 'Error editando Usuario'
                                return res.redirect('/principal?error=' + errorCreacion)
                            }
                        }

                    } else {
                        const errorCreacion = 'Debe seleccionar al menos un Rol.'
                        return res.redirect('/usuario/vista/editar/' + id + '?error=' + errorCreacion)
                    }

                } else {
                    const error = 'Caracteres no permitidos en el nombre'
                    return res.redirect('/usuario/vista/editar/' + id + '?error=' + error)
                }

            }
        } else {
            return res.redirect('/login')
        }

    }


    @Get('vista/cambiarContrasena/:id')
    cambiarContrasena( // esto es para cuano mande desde La tabla de usuarios es decir el ADMIN
        @Query() parametrosConsulta,
        @Res() res,
        @Param() parametrosRuta,
        @Session() session,
    ) {
        if (session.usuarioId) {

            const esAdministrador = session.roles.some((rol) => rol == 'administrador')
            const esProductor = session.roles.some((rol) => rol == 'productor')
            const esCliente = session.roles.some((rol) => rol == 'cliente')

            return res.render('usuario/contrasena',
                {
                    error: parametrosConsulta.error,
                    usuarioId: parametrosRuta.id,
                    id: session.usuarioId,
                    esAdministrador:esAdministrador,
                    esProductor: esProductor,
                    esCliente: esCliente,
                })
        } else {
            return res.redirect('/login')
        }

    }


    @Get('vista/cambiarContrasena')
    cambiarContrasenaMiCuenta( // esto es para cuano mande desde mi cuenta
        @Query() parametrosConsulta,
        @Res() res,
        @Session() session,
    ) {
        if (session.usuarioId) {

            const esAdministrador = session.roles.some((rol) => rol == 'administrador')
            const esProductor = session.roles.some((rol) => rol == 'productor')
            const esCliente = session.roles.some((rol) => rol == 'cliente')

            return res.render('usuario/contrasena',
                {
                    error: parametrosConsulta.error,
                    usuarioId: session.usuarioId,
                    id: session.usuarioId,
                    esAdministrador:esAdministrador,
                    esProductor: esProductor,
                    esCliente: esCliente,
                })

        } else {
            return res.redirect('/login')
        }
    }


    @Post('cambiarContrasenaDesdeVista/:id')
    async cambiarContrasenaDesdeVista(
        @Body() paramBody,
        @Res() res,
        @Param() parametrosRuta,
        @Session() session,
    ) {
        if (session.usuarioId) {
            const id = Number(parametrosRuta.id)

            const contrasenaValidada = new ContrasenaUpdateDto()

            contrasenaValidada.actual = paramBody.actual
            contrasenaValidada.nueva = paramBody.nueva
            contrasenaValidada.confirmacionNueva = paramBody.confirmacionNueva

            const errores: ValidationError[] = await validate(contrasenaValidada)
            let error = 'Error en el formato de los datos'
            if (errores.length > 0) {
                return res.redirect('/usuario/vista/cambiarContrasena/' + id + '?error=' + error)
            } else {

                if (paramBody.nueva === paramBody.confirmacionNueva) {
                    const viejaContrasena = await this._usuarioService.buscarUno(id)

                    if (viejaContrasena.password === paramBody.actual) {

                        const contrasenaNueva = {
                            usuarioId: id,
                            password: paramBody.nueva,
                        } as UsuarioEntity

                        const contrasenaActualizada = await this._usuarioService.editarUno(contrasenaNueva)

                        if (contrasenaActualizada) {
                            const exito = 'Contraseña actualizada exitosamente.'
                            return res.redirect('/principal?exito=' + exito)
                        } else {
                            error = 'Error al cambiar la contraseña.'
                            return res.redirect('/principal?error=' + error)
                        }

                    } else {
                        error = 'Su contraseña actual no es la correcta. Ingrese nuevamente.'
                        return res.redirect('/usuario/vista/cambiarContrasena/' + id + '?error=' + error)
                    }

                } else {
                    error = 'No coinciden las contraseñas nuevas. Ingrese nuevamente'
                    return res.redirect('/usuario/vista/cambiarContrasena/' + id + '?error=' + error)
                }
            }

        } else {
            return res.redirect('/login')
        }
    }


}
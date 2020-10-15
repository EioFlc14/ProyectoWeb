import {Body, Controller, Get, Post, Query, Req, Res, Session} from '@nestjs/common';
import {AppService} from './app.service';
import {UsuarioCreateDto} from "./usuario/dto/usuario.create-dto";
import {validate, ValidationError} from "class-validator";
import {UsuarioService} from "./usuario/usuario.service";
import {UsuarioEntity} from "./usuario/usuario.entity";
import {RolService} from "./rol/rol.service";
import {UsuarioRolService} from "./usuario-rol/usuario-rol.service";
import {UsuarioRolEntity} from "./usuario-rol/usuario-rol.entity";

@Controller()
export class AppController {
    constructor(
        private readonly appService: AppService,
        private readonly _usuarioService: UsuarioService,
        private readonly _rolService: RolService,
        private readonly _usuarioRolService: UsuarioRolService,
    ) {

    }


    @Get('login')
    login(
        @Query() paramConsulta,
        @Res() res,
        @Session() session,
    ) {
        if(session.usuarioId){
            return res.redirect('/principal?exito=Usted ya tiene una sesión activa.')
        } else {
            return res.render('login',
                {
                    error: paramConsulta.error,
                    exito: paramConsulta.exito,
                })
        }

    }


    @Get('principal')
    principal(
        @Query() paramConsulta,
        @Res() res,
        @Session() session,
    ) {
        if (session.usuarioId) {
            const esAdministrador = session.roles.some((rol) => rol == 'administrador')
            const esProductor = session.roles.some((rol) => rol == 'productor')
            const esCliente = session.roles.some((rol) => rol == 'cliente')
            return res.render('principal',
                {
                    usuario: paramConsulta.usuario,
                    exito: paramConsulta.exito,
                    error: paramConsulta.error,
                    id: session.usuarioId,
                    esAdministrador: esAdministrador,
                    esProductor: esProductor,
                    esCliente: esCliente,
                })
        } else {
            return res.redirect('login')
        }
    }


    @Post('loginDesdeVista')
    async loginDesdeVista(
        @Body() paramBody,
        @Res() res,
        @Session() session,
    ) {

        try {
            const user = paramBody.user
            const password = paramBody.password

            const respuestaLogeo = await this._usuarioService.validarLogin(user, password)

            if (respuestaLogeo.length == 1) {
                const usuario = respuestaLogeo[0]

                session.usuarioId = usuario.usuarioId

                const roles = await this._usuarioRolService.buscarRolesUnUsuario(usuario.usuarioId)

                session.roles = []

                roles.forEach((rol) => {
                    if (rol.rol.toLowerCase() == 'cliente') {
                        session.roles.push("cliente")
                    }
                    if (rol.rol.toLowerCase() == 'productor') {
                        session.roles.push("productor")
                    }
                    if (rol.rol.toLowerCase() == 'administrador') {
                        session.roles.push("administrador")
                    }
                })

                return res.redirect('principal')

            } else {
                return res.redirect('login?error=Usuario no encontrado. Revise sus credenciales.')
            }
        } catch (error) {
            console.error('Error del servidor')
            return res.redirect('login?error=Error en el servidor.')
        }

    }


    @Get('registro')
    registro(
        @Query()
            parametrosConsulta,
        @Res()
            res,
    ) {
        return res.render('registro',
            {
                error: parametrosConsulta.error,
                nombre: parametrosConsulta.nombre,
                apellido: parametrosConsulta.apellido,
                email: parametrosConsulta.email,
                telefono: parametrosConsulta.telefono,
                direccion: parametrosConsulta.direccion,
                username: parametrosConsulta.username,
                identificacion: parametrosConsulta.identificacion
            })
    }


    @Post('registroDesdeVista')
    async registroDesdeVista(
        @Body() paramBody,
        @Res() res,
    ) {
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
            const error = 'Error en el formato de los datos. Asegúrese de llenar todos los campos correctamente.'
            return res.redirect('registro?error=' + error + texto)
        } else {

            const re = /^[\p{L}'][ \p{L}'-]*[\p{L}]$/u;
            if (re.test(paramBody.nombre)) {

                let respuestaCreacionUsuario

                if (paramBody.password === paramBody.confirmPassword) {
                    if (paramBody.productor != undefined || paramBody.cliente != undefined) {
                        const emailExistente = await this._usuarioService.emailRegistrado(paramBody.email)
                        if (emailExistente.length > 0) {
                            const errorCreacion = 'Correo ya registrado. Ingrese otro.'
                            return res.redirect('registro?error=' + errorCreacion + texto)
                        } else {
                            const usernameExistente = await this._usuarioService.usernameRegistrado(paramBody.username)

                            if (usernameExistente.length > 0) {
                                const errorCreacion = 'Nombre de usuario ya registrado. Ingrese otro.'
                                return res.redirect('registro?error=' + errorCreacion + texto)
                            } else {
                                try {
                                    respuestaCreacionUsuario = await this._usuarioService.crearUno(paramBody)
                                } catch (e) {
                                    console.error(e)
                                    const errorCreacion = 'Error al crear el Usuario'
                                    return res.redirect('registro?error=' + errorCreacion + texto)
                                }

                                let respuestaRoles

                                if (respuestaCreacionUsuario) {

                                    let productorRol = true
                                    let clienteRol = true

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
                                            return res.redirect('registro?error=' + errorCreacion + texto)
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
                                            return res.redirect('registro?error=' + errorCreacion + texto)
                                        }
                                    }

                                    if (clienteRol && productorRol) {
                                        const exito = 'Usuario creado correctamente'
                                        return res.redirect('login?exito=' + exito)
                                    } else {
                                        const errorCreacion = 'Error al crear el Usuario.'
                                        return res.redirect('registro?error=' + errorCreacion + texto)
                                    }

                                } else {
                                    const errorCreacion = 'Error al crear el Usuario'
                                    return res.redirect('registro?error=' + errorCreacion + texto)
                                }
                            }

                        }
                    } else {
                        const errorCreacion = 'Debe seleccionar al menos un Rol.'
                        return res.redirect('registro?error=' + errorCreacion + texto)
                    }

                } else {
                    const errorCreacion = 'Las contraseñas no coinciden. Deben ser las mismas.'
                    return res.redirect('registro?error=' + errorCreacion + texto)
                }

            } else {
                const error = 'Caracteres no permitidos.'
                return res.redirect('registro?error=' + error)
            }
        }

    }


    @Get('cerrarSesion')
    cerrarSesion(
        @Session() session,
        @Res() res,
        @Req() req,
    ) {
        if (session.usuarioId) {
            session.usuarioId = undefined
            session.roles = undefined
            req.session.destroy()
            return res.redirect('login')
        } else {
            return res.redirect('login')
        }


    }


}

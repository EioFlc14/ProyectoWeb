import {Body, Controller, Get, Post, Query, Res} from '@nestjs/common';
import { AppService } from './app.service';
import {UsuarioCreateDto} from "./usuario/dto/usuario.create-dto";
import {validate, ValidationError} from "class-validator";
import {UsuarioService} from "./usuario/usuario.service";
import {UsuarioEntity} from "./usuario/usuario.entity";

@Controller()
export class AppController {
  constructor(
      private readonly appService: AppService,
      private readonly _usuarioService: UsuarioService,
  ) {

  }

/*  @Get()
  getHello(): string {
    return this.appService.getHello();
  }*/

  @Get('login')  // esto de seguro es en otro controler pero HASTA ESO SE DEJA AQUÍ
  login(
      @Query() paramConsulta,
      @Res() res,
  ){
    return res.render('login',
        {
          error: paramConsulta.error,
          exito: paramConsulta.exito,
        })
  }


  @Get('principal')  // esto de seguro es en otro controler pero HASTA ESO SE DEJA AQUÍ
  principal(
      @Query() paramConsulta,
      @Res() res,
  ){
    return res.render('principal',
        {
          usuario: paramConsulta.usuario,
          exito: paramConsulta.exito,
          error: paramConsulta.error,
        })
  }


  @Post('loginDesdeVista')
  async loginDesdeVista(
      @Body() paramBody,
      @Res() res,
  ){

    try {

      //console.log("BODY PARAM:" + paramBody.user + ' ' + paramBody.password)
      const user = paramBody.user
      const password = paramBody.password

      const respuestaLogeo = await this._usuarioService.validarLogin(user, password)

      //console.log("RESPUESTA LOGEO: " + respuestaLogeo)
      if (respuestaLogeo.length == 1){
        const usuario = respuestaLogeo[0]
        // Se manda a la pantalla principal
        const texto = `id=${usuario.usuarioId}&nombre=${usuario.nombre}&apellido=${usuario.apellido}&username=${usuario.username}&email=${usuario.email}&telefono=${usuario.telefono}&direccion=${usuario.direccion}&identificacion=${usuario.identificacion}`
        //console.log(respuestaLogeo)
        return res.redirect('principal?'+texto)

      } else {
        // MENSAJE de que nadie está logeado con esa cuenta.
        return res.redirect('login?error=Usuario no encontrado. Revise sus credenciales.')

      }

    } catch (error){
      console.error('Error del servidor')
      return res.redirect('login?error=Error en el servidor.')
    }

  }


  @Get('registro')  // esto de seguro es en otro controler pero HASTA ESO SE DEJA AQUÍ
  registro(
      @Query() parametrosConsulta,
      @Res() res,
  ){
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
  ){
    let respuestaCreacionUsuario
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
    if(errores.length > 0){
      console.error('Errores:',errores);
      const error = 'Error en el formato de los datos. Asegúrese de llenar todos los campos correctamente.'
      return res.redirect('registro?error='+error+texto)
    } else {

      const re = /^[\p{L}'][ \p{L}'-]*[\p{L}]$/u;
      if(re.test(paramBody.nombre)) {

        let respuestaCreacionUsuario

        if(paramBody.password === paramBody.confirmPassword){
          console.log("EMAIL" + paramBody.email)
          const emailExistente = await this._usuarioService.emailRegistrado(paramBody.email)
          console.log("EMAIL EXISTENTE:" + emailExistente)
          if(emailExistente.length > 0){
            const errorCreacion = 'Correo ya registrado. Ingrese otro.'
            return res.redirect('registro?error=' + errorCreacion + texto)
          } else {
            const usernameExistente = await this._usuarioService.usernameRegistrado(paramBody.username)

            if(usernameExistente.length > 0){
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

              if (respuestaCreacionUsuario) {
                return res.redirect('login?exito=Usuario creado correctamente') // en caso de que all esté OK se envía al inicio
              } else {
                const errorCreacion = 'Error al crear el Usuario'
                return res.redirect('registro?error=' + errorCreacion + texto)
              }
            }

          }

        } else {
          const errorCreacion = 'Las contraseñas no coinciden. Deben ser las mismas.'
          return res.redirect('registro?error=' + errorCreacion + texto)
        }

      } else {
        const error = 'Caracteres no permitidos en el nombre'
        return res.redirect('registro?error='+error)
      }
    }

  }






}

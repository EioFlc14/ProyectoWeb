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
import {UsuarioCreateDto} from "../usuario/dto/usuario.create-dto";
import {validate, ValidationError} from "class-validator";
import {UsuarioService} from "../usuario/usuario.service";
import {UsuarioProductoService} from "./usuario-producto.service";
import {ImagenService} from "../imagen/imagen.service";
import {UsuarioProductoCreateDto} from "./dto/usuario-producto.create-dto";

@Controller('usuario-producto')
export class UsuarioProductoController{

    constructor(
        private readonly _usuarioProductoService: UsuarioProductoService
    ) {
    }


    @Get('vista/inicio') // poner la direccion
    async obtenerUsuarioProductos(
        @Res() res
    ) {
        let resultadoImagen
        let resultadoEncontrado
        try {
            resultadoEncontrado = await this._usuarioProductoService.buscarTodos()
            // VER COMO SE HACE CON LA CONSULTA DE LA IMAGEN PARA JALAR DE PASO ESA
        } catch(error){
            throw new InternalServerErrorException('Error encontrando los productos del usuario')
        }

        if(resultadoEncontrado){
            console.log(resultadoEncontrado)
            return res.render('usuario-producto/inicio', {arregloUsuarioProductos: resultadoEncontrado})
        } else {
            throw new NotFoundException('NO se encontraron productos del usuario')
        }
    }


    @Get('vista/crear')
    crearUsuarioProductoVista(
        @Query() parametrosConsulta,
        @Res() res
    ){
        return res.render('usuario-producto/crear',
            {
                error: parametrosConsulta.error,
                productoProductoId: parametrosConsulta.productoProductoId,
                stock: parametrosConsulta.stock,
                precio: parametrosConsulta.precio,
                usuarioUsuarioId: parametrosConsulta.usuarioUsuarioId,
                unidadUnidadId: parametrosConsulta.unidadUnidadId
            })
    }

    //@Post()
    @Post('crearDesdeVista')
    async crearDesdeVista(
        @Body() paramBody,
        @Res() res,
    ){
        console.log('NOOOOOOOOOOOOOOO')
        //console.log(paramBody)
        let respuestaCreacionUsuario
        const usuarioProductoValidado = new UsuarioProductoCreateDto()
        usuarioProductoValidado.productoProductoId = paramBody.productoProductoId
        usuarioProductoValidado.stock = paramBody.stock
        usuarioProductoValidado.precio = paramBody.precio
        usuarioProductoValidado.unidadUnidadId = paramBody.unidadUnidadId
        usuarioProductoValidado.usuarioUsuarioId = paramBody.usuarioUsuarioId

        const errores: ValidationError[] = await validate(usuarioProductoValidado)
        const texto = `&productoProductoId=${paramBody.productoProductoId}&stock=${paramBody.stock}&precio=${paramBody.precio}&unidadUnidadId=${paramBody.unidadUnidadId}&usuarioUsuarioId=${paramBody.usuarioUsuarioId}`
        if(errores.length > 0){
            console.error('Errores:',errores);
            const error = 'Error en el formato de los datos'
            return res.redirect('/usuario-producto/vista/crear?error='+error+texto)
        } else {
            try {
                console.log(paramBody)
                // ******************* PROBABLEMENTE AQUÍ SE DEBEN CASTEAR LOS DATOS PARA QUE SEAN INGRESADOS
                paramBody.stock = Number(paramBody.stock)
                paramBody.precio = Number(paramBody.precio)
                paramBody.productoProductoId = Number(paramBody.productoProductoId)
                paramBody.unidadUnidadId = Number(paramBody.unidadUnidadId)
                paramBody.usuarioUsuarioId = Number(paramBody.usuarioUsuarioId)
                console.log(paramBody)
                respuestaCreacionUsuario = await this._usuarioProductoService.crearUno(paramBody)
            } catch (e){
                console.error(e)
                const errorCreacion = 'Error al crear el Usuario'
                return res.redirect('/usuario-producto/vista/crear?error='+errorCreacion+texto)
            }

            if(respuestaCreacionUsuario){
                return res.redirect('/usuario-producto/vista/inicio') // en caso de que all esté OK se envía al inicio
            } else {
                const errorCreacion = 'Error al crear el Usuario'
                return res.redirect('/usuario-producto/vista/crear?error='+errorCreacion+texto)
            }
        }
    }


    @Post('eliminarDesdeVista/:id')
    async eliminarDesdeVista(
        @Param() paramRuta,
        @Res() res,
    ){
        try{
            await this._usuarioProductoService.eliminarUno(Number(paramRuta.id))
            return res.redirect('/usuario-producto/vista/inicio?mensaje= Usuario Producto Eliminado')
        } catch(error){
            console.error(error)
            return res.redirect('/usuario-producto/vista/inicio?error=Error eliminando usuario producto ')
        }
    }


}
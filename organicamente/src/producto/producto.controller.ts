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
import {ProductoService} from "./producto.service";
import {ProductoCreateDto} from "./dto/producto.create-dto";
import {UsuarioUpdateDto} from "../usuario/dto/usuario.update-dto";
import {UsuarioEntity} from "../usuario/usuario.entity";
import {ProductoUpdateDto} from "./dto/producto.update-dto";
import {ProductoEntity} from "./producto.entity";

@Controller('producto')
export class ProductoController{

    constructor(
        private readonly _productoService: ProductoService
    ) {
    }

    @Get('vista/inicio') // poner la direccion que corresponda
    async obtenerProductos(
        @Res() res
    ) {
        let resultadoEncontrado
        try {
            resultadoEncontrado = await this._productoService.buscarTodos()
        } catch(error){
            throw new InternalServerErrorException('Error encontrando productos')
        }

        if(resultadoEncontrado){
            console.log(resultadoEncontrado)
            return res.render('producto/inicio', {arregloProductos: resultadoEncontrado}) // con esto mando resultadoEcontrado hasta usuario/inicio
        } else {
            throw new NotFoundException('NO se encontraron usuarios')
        }
    }

    @Get('vista/crear')
    crearProductoVista(
        @Query() parametrosConsulta,
        @Res() res
    ){
        return res.render('producto/crear',
            {
                error: parametrosConsulta.error,
                nombre: parametrosConsulta.nombre,
            })
    }

    //@Post()
    @Post('crearDesdeVista')
    async crearDesdeVista(
        @Body() paramBody,
        @Res() res,
    ){

        let respuestaCreacionProducto

        const productoCreado = new ProductoCreateDto()
        productoCreado.nombre = paramBody.nombre

        const texto = `&nombre=${paramBody.nombre}`
        let error

        const errores: ValidationError[] = await validate(productoCreado)

        if(errores.length > 0){
            console.error('Errores:',errores);
            error = 'Error en el formato de los datos'
            return res.redirect('/producto/vista/crear?error='+error+texto)
        } else {
            const re = /^[\p{L}'][ \p{L}'-]*[\p{L}]$/u;
            if(re.test(paramBody.nombre)) {
                console.log(paramBody.nombre)
                try {
                    respuestaCreacionProducto = await this._productoService.crearUno(paramBody)
                } catch (e){
                    console.error(e)
                    error = 'Error al crear el Producto'
                    return res.redirect('/producto/vista/crear?error='+error+texto)
                }

                if(respuestaCreacionProducto){
                    return res.redirect('/producto/vista/inicio') // en caso de que all esté OK se envía al inicio
                } else {
                    error = 'Error al crear el Producto'
                    return res.redirect('/producto/vista/crear?error='+error+texto)
                }

            } else {
                error = 'Caracteres no permitidos en el nombre'
                return res.redirect('/producto/vista/crear?error='+error+texto)
            }
        }

    }


    @Get('vista/editar/:id') // Controlador
    async editarProductoVista(
        @Query() parametrosConsulta,
        @Res() res,
        @Param() parametrosRuta
    ) {
        const id = Number(parametrosRuta.id)
        let productoEncontrado

        try {
            productoEncontrado = await this._productoService.buscarUno(id)
        } catch (error) {
            console.error('Error del servidor')
            return res.redirect('/producto/vista/inicio?mensaje=Error buscando producto')
        }

        if (productoEncontrado){
            return res.render(
                'producto/crear',
                {
                    error: parametrosConsulta.error,
                    producto: productoEncontrado
                }
            )
        } else {
            return res.redirect('/producto/vista/inicio?mensaje=Producto no encontrado')
        }

    }


    @Post('editarDesdeVista/:id')
    async editarDesdeVista(
        @Param() parametrosRuta,
        @Body() paramBody,
        @Res() res
    ){

        const productoValidado = new ProductoUpdateDto()
        productoValidado.id = Number(parametrosRuta.id)
        productoValidado.nombre = paramBody.nombre

        const errores: ValidationError[] = await validate(productoValidado)
        if(errores.length > 0){
            console.error('Errores:',errores);
            return res.redirect('/producto/vista/inicio?mensaje= Error en el formato de los datos')
        } else {
            let error
            const re = /^[\p{L}'][ \p{L}'-]*[\p{L}]$/u;
            if(re.test(paramBody.nombre)) {

                const usuarioEditado = {
                    productoId: Number(parametrosRuta.id),
                    nombre: paramBody.nombre
                } as ProductoEntity

                try {
                    await this._productoService.editarUno(usuarioEditado)
                    return res.redirect('/producto/vista/inicio?mensaje= Producto editado correctamente') // en caso de que all esté OK se envía al inicio
                } catch (e) {
                    console.error(e)
                    error = 'Error editando Producto'
                    return res.redirect('/producto/vista/inicio?mensaje=' + error)
                }
            } else {
                error = 'Caracteres no permitidos en el nombre'
                return res.redirect('/producto/vista/crear?error='+error)
            }
        }

    }



    @Post('eliminarDesdeVista/:id')
    async eliminarDesdeVista(
        @Param() paramRuta,
        @Res() res,
    ){
        try{
            await this._productoService.eliminarUno(Number(paramRuta.id))
            return res.redirect('/producto/vista/inicio?mensaje= Producto Eliminado')
        } catch(error){
            console.error(error)
            return res.redirect('/producto/vista/inicio?error=Error eliminando producto')
        }
    }




}
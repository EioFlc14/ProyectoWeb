import {
    Body,
    Controller,
    Get,
    InternalServerErrorException,
    NotFoundException,
    Param,
    Post,
    Query,
    Res, Session
} from "@nestjs/common";
import {validate, ValidationError} from "class-validator";
import {ProductoService} from "./producto.service";
import {ProductoCreateDto} from "./dto/producto.create-dto";
import {ProductoUpdateDto} from "./dto/producto.update-dto";
import {ProductoEntity} from "./producto.entity";

@Controller('producto')
export class ProductoController {

    constructor(
        private readonly _productoService: ProductoService
    ) {
    }

    @Get('vista/inicio')
    async obtenerProductos(
        @Res() res,
        @Query() parametrosConsulta,
        @Session() session,
    ) {
        if (session.usuarioId) {
            let resultadoEncontrado
            try {
                resultadoEncontrado = await this._productoService.buscarTodos()
            } catch (e) {
                const error = 'Error al obtener datos.'
                return res.redirect('/principal?error=' + error)
            }

            const esAdministrador = session.roles.some((rol) => rol == 'administrador')
            const esProductor = session.roles.some((rol) => rol == 'productor')
            const esCliente = session.roles.some((rol) => rol == 'cliente')

            if (resultadoEncontrado) {
                console.log(resultadoEncontrado)
                return res.render('producto/inicio', {
                    arregloProductos: resultadoEncontrado,
                    error: parametrosConsulta.error,
                    id: session.usuarioId,
                    esAdministrador:esAdministrador,
                    esProductor: esProductor,
                    esCliente: esCliente,
                })
            } else {
                const error = 'Error al obtener datos.'
                return res.redirect('/principal?error=' + error)
            }
        } else {
            return res.redirect('/login')
        }

    }

    @Get('vista/crear')
    crearProductoVista(
        @Query() parametrosConsulta,
        @Res() res,
        @Session() session,
    ) {
        if (session.usuarioId) {

            const esAdministrador = session.roles.some((rol) => rol == 'administrador')
            const esProductor = session.roles.some((rol) => rol == 'productor')
            const esCliente = session.roles.some((rol) => rol == 'cliente')

            return res.render('producto/crear',
                {
                    error: parametrosConsulta.error,
                    nombre: parametrosConsulta.nombre,
                    id: session.usuarioId,
                    esAdministrador:esAdministrador,
                    esProductor: esProductor,
                    esCliente: esCliente,
                })
        } else {
            return res.redirect('/login')
        }

    }

    //@Post()
    @Post('crearDesdeVista')
    async crearDesdeVista(
        @Body() paramBody,
        @Res() res,
        @Session() session,
    ) {
        if (session.usuarioId) {
            let respuestaCreacionProducto

            const productoCreado = new ProductoCreateDto()
            productoCreado.nombre = paramBody.nombre

            const texto = `&nombre=${paramBody.nombre}`
            let error

            const errores: ValidationError[] = await validate(productoCreado)

            if (errores.length > 0) {
                console.error('Errores:', errores);
                error = 'Error en el formato de los datos'
                return res.redirect('/producto/vista/inicio?error=' + error + texto)
            } else {
                const re = /^[\p{L}'][ \p{L}'-]*[\p{L}]$/u;
                if (re.test(paramBody.nombre)) {
                    console.log(paramBody.nombre)
                    try {
                        respuestaCreacionProducto = await this._productoService.crearUno(paramBody)
                    } catch (e) {
                        console.error(e)
                        error = 'Error al crear el Producto'
                        return res.redirect('/producto/vista/inicio?error=' + error + texto)
                    }

                    if (respuestaCreacionProducto) {
                        const exito = 'Producto creado exitosamente.'
                        return res.redirect('/principal?exito=' + exito) // en caso de que all esté OK se envía al inicio
                    } else {
                        error = 'Error al crear el Producto'
                        return res.redirect('/principal?error=' + error + texto)
                    }

                } else {
                    error = 'Caracteres no permitidos en el nombre'
                    return res.redirect('/producto/vista/inicio?error=' + error + texto)
                }
            }
        } else {
            return res.redirect('/login')
        }
    }


    @Get('vista/editar/:idProducto')
    async editarProductoVista(
        @Query() parametrosConsulta,
        @Res() res,
        @Param() parametrosRuta,
        @Session() session,
    ) {

        if (session.usuarioId) {
            const id = Number(parametrosRuta.idProducto)
            let productoEncontrado

            try {
                productoEncontrado = await this._productoService.buscarUno(id)
            } catch (error) {
                console.error('Error del servidor')
                return res.redirect('/producto/vista/inicio?mensaje=Error buscando producto')
            }

            const esAdministrador = session.roles.some((rol) => rol == 'administrador')
            const esProductor = session.roles.some((rol) => rol == 'productor')
            const esCliente = session.roles.some((rol) => rol == 'cliente')

            if (productoEncontrado) {
                return res.render(
                    'producto/crear',
                    {
                        error: parametrosConsulta.error,
                        producto: productoEncontrado,
                        id: session.usuarioId,
                        esAdministrador:esAdministrador,
                        esProductor: esProductor,
                        esCliente: esCliente,
                    }
                )
            } else {
                return res.redirect('/producto/vista/inicio?mensaje=Producto no encontrado')
            }
        } else {
            return res.redirect('/login')
        }


    }


    @Post('editarDesdeVista/:idProducto')
    async editarDesdeVista(
        @Param() parametrosRuta,
        @Body() paramBody,
        @Res() res,
        @Session() session,
    ) {

        if (session.usuarioId) {
            const productoValidado = new ProductoUpdateDto()
            productoValidado.id = Number(parametrosRuta.idProducto)
            productoValidado.nombre = paramBody.nombre

            const errores: ValidationError[] = await validate(productoValidado)
            if (errores.length > 0) {
                console.error('Errores:', errores);
                return res.redirect('/producto/vista/inicio?mensaje= Error en el formato de los datos')
            } else {
                let error
                const re = /^[\p{L}'][ \p{L}'-]*[\p{L}]$/u;
                if (re.test(paramBody.nombre)) {

                    const usuarioEditado = {
                        productoId: Number(parametrosRuta.idProducto),
                        nombre: paramBody.nombre
                    } as ProductoEntity

                    try {
                        await this._productoService.editarUno(usuarioEditado)
                        return res.redirect('/producto/vista/inicio?mensaje= Producto editado correctamente')
                    } catch (e) {
                        console.error(e)
                        error = 'Error editando Producto'
                        return res.redirect('/producto/vista/inicio?mensaje=' + error)
                    }
                } else {
                    error = 'Caracteres no permitidos en el nombre'
                    return res.redirect('/producto/vista/crear?error=' + error)
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
                    await this._productoService.eliminarUno(Number(paramRuta.id))
                    return res.redirect('/producto/vista/inicio?mensaje= Producto Eliminado')
                } catch (error) {
                    console.error(error)
                    return res.redirect('/producto/vista/inicio?error=Error eliminando producto')
                }
            } else {
                return res.redirect('login')
            }

        }*/


}
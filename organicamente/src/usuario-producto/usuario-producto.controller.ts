import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    Query, Req,
    Res, Session, UploadedFile, UseInterceptors
} from "@nestjs/common";

import {validate, ValidationError} from "class-validator";
import {UsuarioProductoService} from "./usuario-producto.service";
import {UsuarioProductoCreateDto} from "./dto/usuario-producto.create-dto";
import {UsuarioProductoUpdateDto} from "./dto/usuario-producto.update-dto";
import {UsuarioProductoEntity} from "./usuario-producto.entity";
import {FileInterceptor} from "@nestjs/platform-express";
import {diskStorage} from 'multer';
import {defaultImagen, editFileName, imageFileFilter} from "../utils/file-uploading.utils";
import {ProductoService} from "../producto/producto.service";
import {UnidadService} from "../unidad/unidad.service";

const fs = require('fs') // para eliminar las fotos que quedan luego de actualizar una de estas.


@Controller('usuario-producto')
export class UsuarioProductoController {

    constructor(
        private readonly _usuarioProductoService: UsuarioProductoService,
        private readonly _productoService: ProductoService,
        private readonly _unidadService: UnidadService
    ) {
    }


    @Get('vista/inicio/:rol')
    async obtenerUsuarioProductos(
        @Param() parametrosRuta,
        @Query() parametrosConsulta,
        @Res() res,
        @Session() session,
    ) {

        if (session.usuarioId) {
            let resultadoEncontrado = []
            try {
                if (parametrosConsulta.busqueda == undefined) {
                    parametrosConsulta.busqueda = ''
                }

                if (parametrosRuta.rol === 'cliente' || parametrosRuta.rol === 'admin') {
                    resultadoEncontrado = await this._usuarioProductoService.busquedaProductoCamposClienteAdmin(parametrosConsulta.busqueda)
                } else if (parametrosRuta.rol === 'productor') {
                    const id = session.usuarioId
                    resultadoEncontrado = await this._usuarioProductoService.busquedaProductoCamposProductor(parametrosConsulta.busqueda, id)
                }

                const esAdministrador = session.roles.some((rol) => rol == 'administrador')
                const esProductor = session.roles.some((rol) => rol == 'productor')
                const esCliente = session.roles.some((rol) => rol == 'cliente')


                return res.render('usuario-producto/inicio', {
                    arregloUsuarioProductos: resultadoEncontrado,
                    rol: parametrosRuta.rol,
                    id: session.usuarioId,
                    esAdministrador:esAdministrador,
                    esProductor: esProductor,
                    esCliente: esCliente,
                })

            } catch (error) {
                console.error(error)

                const esAdministrador = session.roles.some((rol) => rol == 'administrador')
                const esProductor = session.roles.some((rol) => rol == 'productor')
                const esCliente = session.roles.some((rol) => rol == 'cliente')


                return res.render('usuario-producto/inicio', {
                    arregloUsuarioProductos: resultadoEncontrado,
                    rol: parametrosRuta.rol,
                    id: session.usuarioId,
                    esAdministrador:esAdministrador,
                    esProductor: esProductor,
                    esCliente: esCliente,
                })
            }
        } else {
            return res.redirect('/login')
        }

    }


    @Get('vista/crear')
    async crearUsuarioProductoVista(
        @Query() parametrosConsulta,
        @Res() res,
        @Session() session,
    ) {
        if (session.usuarioId) {
            let arregloProductos
            let arregloUnidades

            try {
                arregloProductos = await this._productoService.buscarTodos()
                arregloUnidades = await this._unidadService.buscarTodos()
            } catch (e) {
                const error = 'Error obteniendo datos.'
                return res.redirect('/principal?error=' + error)
            }

            if (arregloUnidades && arregloProductos) {

                const esAdministrador = session.roles.some((rol) => rol == 'administrador')
                const esProductor = session.roles.some((rol) => rol == 'productor')
                const esCliente = session.roles.some((rol) => rol == 'cliente')

                return res.render('usuario-producto/crear',
                    {
                        error: parametrosConsulta.error,
                        producto: parametrosConsulta.producto,
                        stock: parametrosConsulta.stock,
                        imagen: parametrosConsulta.imagen,
                        precio: parametrosConsulta.precio,
                        usuario: parametrosConsulta.usuario,
                        unidad: parametrosConsulta.unidad,
                        arregloUnidades: arregloUnidades,
                        arregloProductos: arregloProductos,
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
    @UseInterceptors(
        FileInterceptor('imagen', {
            storage: diskStorage({
                destination: 'publico/imagenes',
                filename: editFileName,
            }),
            fileFilter: imageFileFilter
        }))
    async crearDesdeVista(
        @Body() paramBody,
        @Res() res,
        @Req() req,
        @UploadedFile() file,
        @Session() session,
    ) {
        if (session.usuarioId) {
            if (req.fileValidationError) {
                return res.redirect('/usuario-producto/vista/crear?error=' + req.fileValidationError)
            }

            let respuestaCreacionUsuario
            const usuarioProductoValidado = new UsuarioProductoCreateDto()
            usuarioProductoValidado.productoProductoId = paramBody.producto
            usuarioProductoValidado.stock = paramBody.stock
            usuarioProductoValidado.precio = paramBody.precio
            if (file == undefined) {
                usuarioProductoValidado.imagen = defaultImagen
            } else {
                usuarioProductoValidado.imagen = file.path.split('/')[2]
            }
            usuarioProductoValidado.unidadUnidadId = paramBody.unidad

            const errores: ValidationError[] = await validate(usuarioProductoValidado)
            const texto = `&producto=${paramBody.producto}&stock=${paramBody.stock}&precio=${paramBody.precio}&imagen=${paramBody.imagen}&unidad=${paramBody.unidad}&usuario=${paramBody.usuario}`
            if (errores.length > 0) {
                console.log(errores)
                const error = 'Error en el formato de los datos'
                return res.redirect('/usuario-producto/vista/crear?error=' + error + texto)
            } else {
                try {
                    paramBody.stock = Number(paramBody.stock)
                    paramBody.precio = Number(paramBody.precio)
                    paramBody.producto = Number(paramBody.producto)
                    paramBody.unidad = Number(paramBody.unidad)
                    paramBody.usuario = session.usuarioId

                    if (paramBody.precio > 0) {
                        if (file == undefined) {
                            paramBody.imagen = defaultImagen
                        } else {
                            paramBody.imagen = file.path.split('/')[2]
                        }

                        let usuarioProducto = paramBody as UsuarioProductoEntity
                        usuarioProducto = JSON.parse(JSON.stringify(usuarioProducto));
                        respuestaCreacionUsuario = await this._usuarioProductoService.crearUno(usuarioProducto)
                    } else {
                        const errorCreacion = 'El precio debe ser mayor a 0.'
                        return res.redirect('/usuario-producto/vista/crear?error=' + errorCreacion + texto)
                    }

                } catch (e) {
                    console.error(e)
                    const errorCreacion = 'Error al crear el producto.'
                    return res.redirect('/usuario-producto/vista/crear?error=' + errorCreacion + texto)
                }

                if (respuestaCreacionUsuario) {
                    return res.redirect('/usuario-producto/vista/inicio/productor') // en caso de que all esté OK se envía al inicio
                } else {
                    const errorCreacion = 'Error al crear el producto'
                    return res.redirect('/usuario-producto/vista/crear?error=' + errorCreacion + texto)
                }
            }
        } else {
            return res.redirect('/login')
        }
    }


    @Get('vista/editar/:idUsuarioProducto')
    async editarUsuarioProductoVista(
        @Query() parametrosConsulta,
        @Res() res,
        @Param() parametrosRuta,
        @Session() session,
    ) {
        if (session.usuarioId) {
            const id = Number(parametrosRuta.idUsuarioProducto)
            let usuarioProductoEncontrado
            let arregloUnidades

            try {
                usuarioProductoEncontrado = await this._usuarioProductoService.buscarUno(id)
                arregloUnidades = await this._unidadService.buscarTodos()
            } catch (error) {
                console.error('Error del servidor')
                return res.redirect('/usuario-producto/vista/inicio?mensaje=Error obteniendo datos')
            }

            if (usuarioProductoEncontrado) {

                const esAdministrador = session.roles.some((rol) => rol == 'administrador')
                const esProductor = session.roles.some((rol) => rol == 'productor')
                const esCliente = session.roles.some((rol) => rol == 'cliente')

                return res.render(
                    'usuario-producto/crear',
                    {
                        error: parametrosConsulta.error,
                        usuarioProducto: usuarioProductoEncontrado,
                        arregloUnidades: arregloUnidades,
                        id: session.usuarioId,
                        esAdministrador:esAdministrador,
                        esProductor: esProductor,
                        esCliente: esCliente,
                    }
                )
            } else {
                return res.redirect('/usuario-producto/vista/inicio?mensaje=Usuario Producto no encontrado')
            }
        } else {
            return res.redirect('/login')
        }

    }


    @Post('editarDesdeVista/:id')
    @UseInterceptors(
        FileInterceptor('imagen', {
            storage: diskStorage({
                destination: 'publico/imagenes',
                filename: editFileName,
            }),
            fileFilter: imageFileFilter
        }))
    async editarDesdeVista(
        @Param() parametrosRuta,
        @Body() paramBody,
        @Res() res,
        @UploadedFile() file,
        @Session() session,
    ) {

        if (session.usuarioId) {
            const usuarioProductoValidado = new UsuarioProductoUpdateDto()
            usuarioProductoValidado.id = Number(parametrosRuta.id)
            usuarioProductoValidado.stock = paramBody.stock
            usuarioProductoValidado.precio = paramBody.precio
            if (file == undefined) {
                usuarioProductoValidado.imagen = defaultImagen
            } else {
                usuarioProductoValidado.imagen = file.path.split('/')[2]
            }

            const errores: ValidationError[] = await validate(usuarioProductoValidado)
            if (errores.length > 0) {
                return res.redirect('/principal?error= Error al editar el producto.')
            } else {

                if (file == undefined) {
                    paramBody.imagen = defaultImagen
                } else {
                    paramBody.imagen = file.path.split('/')[2]
                }

                const usuarioProducto = {
                    usuarioProductoId: Number(parametrosRuta.id),
                    stock: Number(paramBody.stock),
                    precio: Number(paramBody.precio),
                    imagen: paramBody.imagen,
                } as UsuarioProductoEntity

                try {
                    await this._usuarioProductoService.editarUno(usuarioProducto)
                    return res.redirect('/principal?exito= Producto editado correctamente')
                } catch (e) {
                    console.error(e)
                    const errorCreacion = 'Error al editar el producto.'
                    return res.redirect('/principal?error=' + errorCreacion)
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
    ) {
        try {
            await this._usuarioProductoService.eliminarUno(Number(paramRuta.id))
            return res.redirect('/usuario-producto/vista/inicio?mensaje= Usuario Producto Eliminado')
        } catch (error) {
            console.error(error)
            return res.redirect('/usuario-producto/vista/inicio?error=Error eliminando usuario producto ')
        }
    }*/


}
import {
    Body,
    Controller,
    Get,
    InternalServerErrorException,
    NotFoundException,
    Param,
    Post,
    Query, Req,
    Res, UploadedFile, UseInterceptors
} from "@nestjs/common";
import {validate, ValidationError} from "class-validator";
import {UsuarioProductoService} from "./usuario-producto.service";
import {UsuarioProductoCreateDto} from "./dto/usuario-producto.create-dto";
import {UsuarioProductoUpdateDto} from "./dto/usuario-producto.update-dto";
import {UsuarioProductoEntity} from "./usuario-producto.entity";
import {FileInterceptor} from "@nestjs/platform-express";
import { diskStorage } from 'multer';
import {defaultImagen, editFileName, editFileNameEditar, imageFileFilter} from "../utils/file-uploading.utils";
import {ProductoService} from "../producto/producto.service";
import {UnidadService} from "../unidad/unidad.service";

const fs = require('fs')


@Controller('usuario-producto')
export class UsuarioProductoController{

    constructor(
        private readonly _usuarioProductoService: UsuarioProductoService,
        private readonly _productoService: ProductoService,
        private readonly _unidadService: UnidadService
    ) {
    }


    @Get('vista/inicio') // poner la direccion
    async obtenerUsuarioProductos(
        @Res() res
    ) {
        let resultadoEncontrado
        try {
            resultadoEncontrado = await this._usuarioProductoService.buscarTodos()
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
    async crearUsuarioProductoVista(
        @Query() parametrosConsulta,
        @Res() res
    ){

        let arregloProductos
        let arregloUnidades

        try {
            arregloProductos = await this._productoService.buscarTodos()
            arregloUnidades = await this._unidadService.buscarTodos()
        } catch(error) {
            throw new NotFoundException('Error obteniendo datos.')
        }

        if(arregloUnidades && arregloProductos){
            console.log("ARREGLO PRODUCTOS:" + arregloProductos)
            console.log("ARREGLO UNIDADES:" + arregloUnidades)
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
                    arregloProductos: arregloProductos
                })
        } else {
            throw new NotFoundException('No hay suficientes datos para esta acción. Inténtelo más tarde.')
        }


    }

    //@Post()
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
        @UploadedFile() file
    ){
        if(req.fileValidationError){
            return res.redirect('/usuario-producto/vista/crear?error='+req.fileValidationError)
        }

        let respuestaCreacionUsuario
        const usuarioProductoValidado = new UsuarioProductoCreateDto()
        usuarioProductoValidado.productoProductoId = paramBody.producto
        usuarioProductoValidado.stock = paramBody.stock
        usuarioProductoValidado.precio = paramBody.precio
        if (file == undefined){
            usuarioProductoValidado.imagen = defaultImagen
        } else {
            usuarioProductoValidado.imagen = file.path.split('/')[2]
        }
        usuarioProductoValidado.unidadUnidadId = paramBody.unidad
        usuarioProductoValidado.usuarioUsuarioId = paramBody.usuario

        const errores: ValidationError[] = await validate(usuarioProductoValidado)
        const texto = `&producto=${paramBody.producto}&stock=${paramBody.stock}&precio=${paramBody.precio}&imagen=${paramBody.imagen}&unidad=${paramBody.unidad}&usuario=${paramBody.usuario}`
        if(errores.length > 0){
            console.error('Errores:',errores);
            const error = 'Error en el formato de los datos'
            return res.redirect('/usuario-producto/vista/crear?error='+error+texto)
        } else {
            try {
                paramBody.stock = Number(paramBody.stock)
                paramBody.precio = Number(paramBody.precio)
                paramBody.producto = Number(paramBody.producto)
                paramBody.unidad = Number(paramBody.unidad)
                paramBody.usuario = Number(paramBody.usuario)
                if (file == undefined){
                    paramBody.imagen = defaultImagen
                } else {
                    paramBody.imagen = file.path.split('/')[2]
                }

                console.log(paramBody.image)

                let usuarioProducto = paramBody as UsuarioProductoEntity
                usuarioProducto = JSON.parse(JSON.stringify(usuarioProducto));

                console.log(usuarioProducto)
                respuestaCreacionUsuario = await this._usuarioProductoService.crearUno(usuarioProducto)
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


    @Get('vista/editar/:id') // Controlador
    async editarUsuarioProductoVista(
        @Query() parametrosConsulta,
        @Res() res,
        @Param() parametrosRuta
    ) {
        const id = Number(parametrosRuta.id)
        let usuarioProductoEncontrado
        let arregloUnidades

        try {
            usuarioProductoEncontrado = await this._usuarioProductoService.buscarUno(id)
            arregloUnidades = await this._unidadService.buscarTodos()
        } catch (error) {
            console.error('Error del servidor')
            return res.redirect('/usuario-producto/vista/inicio?mensaje=Error obteniendo datos')
        }

        if (usuarioProductoEncontrado){
            return res.render(
                'usuario-producto/crear',
                {
                    error: parametrosConsulta.error,
                    usuarioProducto: usuarioProductoEncontrado,
                    arregloUnidades: arregloUnidades
                }
            )
        } else {
            return res.redirect('/usuario-producto/vista/inicio?mensaje=Usuario Producto no encontrado')
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
        @UploadedFile() file
    ){

        const usuarioProductoValidado = new UsuarioProductoUpdateDto()
        usuarioProductoValidado.id = Number(parametrosRuta.id)
        usuarioProductoValidado.stock = paramBody.stock
        usuarioProductoValidado.precio = paramBody.precio
        if (file == undefined){
            usuarioProductoValidado.imagen = defaultImagen
        } else {
            usuarioProductoValidado.imagen = file.path.split('/')[2]
        }

        const errores: ValidationError[] = await validate(usuarioProductoValidado)
        if(errores.length > 0){
            console.error('Errores:',errores);
            return res.redirect('/usuario-producto/vista/inicio?mensaje= Error en el formato de los datos')
        } else {

            if (file == undefined){
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
                return res.redirect('/usuario-producto/vista/inicio?mensaje= Usuario Producto editado correctamente') // en caso de que all esté OK se envía al inicio
            } catch (e){
                console.error(e)
                const errorCreacion = 'Error editando Usuario Producto'
                return res.redirect('/usuario-producto/vista/inicio?mensaje='+errorCreacion)
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
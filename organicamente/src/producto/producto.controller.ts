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
        // **************************+ FALTA VER LO DE LA IMAGEN COMO SE GUARDA ****************************


        const errores: ValidationError[] = await validate(productoCreado)
        const texto = `&nombre=${paramBody.nombre}`
        if(errores.length > 0){
            console.error('Errores:',errores);
            const error = 'Error en el formato de los datos'
            return res.redirect('/producto/vista/crear?error='+error+texto)
        } else {
            try {
                respuestaCreacionProducto = await this._productoService.crearUno(paramBody)
            } catch (e){
                console.error(e)
                const errorCreacion = 'Error al crear el Producto'
                return res.redirect('/producto/vista/crear?error='+errorCreacion+texto)
            }

            if(respuestaCreacionProducto){
                return res.redirect('/producto/vista/inicio') // en caso de que all esté OK se envía al inicio
            } else {
                const errorCreacion = 'Error al crear el Producto'
                return res.redirect('/producto/vista/crear?error='+errorCreacion+texto)
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
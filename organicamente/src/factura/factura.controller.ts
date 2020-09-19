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
import {FacturaService} from "./factura.service";
import {FacturaCreateDto} from "./dto/factura.create-dto";
import {FacturaUpdateDto} from "./dto/factura.update-dto";
import {FacturaEntity} from "./factura.entity";
import {UsuarioProductoService} from "../usuario-producto/usuario-producto.service";
import {DetalleFacturaService} from "../detalle-factura/detalle-factura.service";


@Controller('factura')
export class FacturaController{

    constructor(
        private readonly _facturaService: FacturaService,
        private readonly _usuarioProductoService: UsuarioProductoService,
        private readonly _detalleFacturaService: DetalleFacturaService,
    ) {
    }


    @Get('vista/inicio') // poner la direccion
    async obtenerFacturas(
        @Res() res
    ) {
        let resultadoEncontrado
        try {
            resultadoEncontrado = await this._facturaService.buscarTodos()
        } catch(error){
            throw new InternalServerErrorException('Error encontrando facturas')
        }


        if(resultadoEncontrado){
            console.log(resultadoEncontrado)
            return res.render('factura/inicio', {arregloFacturas: resultadoEncontrado}) // con esto mando resultadoEcontrado hasta usuario/inicio
        } else {
            throw new NotFoundException('NO se encontraron facturas')
        }
    }


    @Get('vista/inicio/usuario/:id') // poner la direccion
    async obtenerFacturasUnUsuario(
        @Res() res,
        @Param() paramRuta
    ) {
        let resultadoEncontrado
        const id = Number(paramRuta.id)
        if (id === undefined){
            try {
                resultadoEncontrado = await this._facturaService.buscarTodosUnUsuario(id)

                if(resultadoEncontrado){
                    console.log(resultadoEncontrado)
                    return res.render('factura/inicio', {arregloFacturas: resultadoEncontrado}) // con esto mando resultadoEcontrado hasta usuario/inicio
                } else {
                    throw new NotFoundException('NO se encontraron facturas')
                }

            } catch(error){
                throw new InternalServerErrorException('Error encontrando facturas')
            }
        } else {
            throw new InternalServerErrorException('Error encontrando facturas')
        }


    }





    @Get('vista/crear')
    async crearFacturaVista(
        @Query() parametrosConsulta,
        @Res() res
    ){

        let arregloUsuarioProductos

        try {
            arregloUsuarioProductos = await this._usuarioProductoService.buscarTodos()
        } catch(error) {
            throw new NotFoundException('Error obteniendo datos.')
        }

        if(arregloUsuarioProductos){
            return res.render('factura/crear',
                {
                    error: parametrosConsulta.error,
                    producto: parametrosConsulta.producto,
                    stock: parametrosConsulta.stock,
                    imagen: parametrosConsulta.imagen,
                    precio: parametrosConsulta.precio,
                    usuario: parametrosConsulta.usuario,
                    unidad: parametrosConsulta.unidad,
                    arregloUsuarioProductos: arregloUsuarioProductos
                })
        } else {
            throw new NotFoundException('No hay suficientes datos para esta acción. Inténtelo más tarde.')
        }


        return res.render('factura/crear',
            {
                error: parametrosConsulta.error,
                facturaId: parametrosConsulta.facturaId,
                total: parametrosConsulta.total,
                fecha: parametrosConsulta.fecha,
                cumplido: parametrosConsulta.cumplido,
                usuario: parametrosConsulta.usuario,
                arregloUsuarioProductos: arregloUsuarioProductos,
            })
    }

    //@Post()
    @Post('crearDesdeVista')
    async crearDesdeVista(
        @Body() paramBody,
        @Res() res,
    ){

        const today = new Date();
        const date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        const dateTime = date+' '+time;


        let respuestaCreacionFactura
        const facturaValidada = new FacturaCreateDto()
        facturaValidada.cumplido = paramBody.cumplido
        facturaValidada.usuarioId = Number(paramBody.usuario)

        //console.log(paramBody)

        const errores: ValidationError[] = await validate(facturaValidada)
        const texto = `&total=${paramBody.total}&fecha=${paramBody.fecha}&cumplido=${paramBody.cumplido}&usuario=${paramBody.usuario}`
        if(errores.length > 0){
            console.error('Errores:',errores);
            const error = 'Error en el formato de los datos'
            return res.redirect('/factura/vista/crear?error='+error+texto)
        } else {
            try {
                paramBody.total = 0.0
                paramBody.fecha = dateTime

                respuestaCreacionFactura = await this._facturaService.crearUno(paramBody)
                console.log("LO CREADO:*******" + respuestaCreacionFactura)


                // AQUI SE TIENE QUE CREAR TODOS LOS DETALLE FACTURAS, supongo que es un FOR.********************

            } catch (e){
                console.error(e)
                const errorCreacion = 'Error al crear la Factura'
                return res.redirect('/factura/vista/crear?error='+errorCreacion+texto)
            }

            if(respuestaCreacionFactura){
                return res.redirect('/factura/vista/inicio') // en caso de que all esté OK se envía al inicio
            } else {
                const errorCreacion = 'Error al crear la Factura'
                return res.redirect('/factura/vista/crear?error='+errorCreacion+texto)
            }
        }

    }


    @Get('vista/editar/:id') // Controlador
    async editarFacturaVista(
        @Query() parametrosConsulta,
        @Res() res,
        @Param() parametrosRuta
    ) {
        const id = Number(parametrosRuta.id)
        let facturaEncontrado
        let detalleFacturaEncontrado

        try {
            facturaEncontrado = await this._facturaService.buscarUno(id)
            detalleFacturaEncontrado = await this._detalleFacturaService.buscarTodos(id)

        } catch (error) {
            console.error('Error del servidor')
            return res.redirect('/factura/vista/inicio?mensaje=Error obteniendo datos.')
        }

        if (facturaEncontrado && detalleFacturaEncontrado){
            console.log(facturaEncontrado)
            console.log("DETALLE FACTURA:"+ detalleFacturaEncontrado)
            return res.render(
                'factura/editar',
                {
                    error: parametrosConsulta.error,
                    factura: facturaEncontrado,
                    orden: detalleFacturaEncontrado,
                }
            )
        } else {
            return res.redirect('/factura/vista/inicio?mensaje=No hay suficientes datos para realizar esta acción. Inténtelo más tarde')
        }
    }




   @Post('editarDesdeVista/:id')
    async editarDesdeVista(
        @Param() parametrosRuta,
        @Body() paramBody,
        @Res() res
    ){

        console.log('LLEGA:'+ paramBody)
        const facturaValidada = new FacturaUpdateDto()
        facturaValidada.id = Number(parametrosRuta.id)
        facturaValidada.cumplido = paramBody.cumplido

        const errores: ValidationError[] = await validate(facturaValidada)
        if(errores.length > 0){
            console.error('Errores:',errores);
            const error = 'Error en el formato de los datos'
            return res.redirect('/factura/vista/inicio?mensaje='+error)
        } else {

            const facturaEditado = {
                facturaId: Number(parametrosRuta.id),
                cumplido : paramBody.cumplido,
            } as FacturaEntity

            try {
                await this._facturaService.editarUno(facturaEditado)
                return res.redirect('/factura/vista/inicio?mensaje= Factura editada correctamente') // en caso de que all esté OK se envía al inicio
            } catch (e){
                console.error(e)
                const errorCreacion = 'Error editando Factura'
                return res.redirect('/factura/vista/inicio?mensaje='+errorCreacion)
            }
        }
    }



    @Post('eliminarDesdeVista/:id') // ESTA NO SE DEBE IMPLEMENTAR YA QUE NO SE PUEDE ELIMINAR UNA FACTURA PERO SE LA HIZO IGUALMENTE
    async eliminarDesdeVista(
        @Param() paramRuta,
        @Res() res,
    ){
        try{
            await this._facturaService.eliminarUno(Number(paramRuta.id))
            return res.redirect('/factura/vista/inicio?mensaje= Factura Eliminada')
        } catch(error){
            console.error(error)
            return res.redirect('/factura/vista/inicio?error=Error eliminando  Factura')
        }
    }

}
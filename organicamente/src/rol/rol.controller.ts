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
import {RolService} from "./rol.service";
import {RolCreateDto} from "./dto/rol.create-dto";
import {RolUpdateDto} from "./dto/rol.update-dto";
import {RolEntity} from "./rol.entity";

@Controller('rol')
export class RolController{

    constructor(
        private readonly _rolService: RolService
    ) {
    }

    @Get('vista/inicio') // poner la direccion que corresponda
    async obtenerRoles(
        @Res() res
    ) {
        let resultadoEncontrado
        try {
            resultadoEncontrado = await this._rolService.buscarTodos()
        } catch(error){
            throw new InternalServerErrorException('Error encontrando roles')
        }

        if(resultadoEncontrado){
            console.log(resultadoEncontrado)
            return res.render('rol/inicio', {arregloRoles: resultadoEncontrado}) // con esto mando resultadoEcontrado hasta usuario/inicio
        } else {
            throw new NotFoundException('NO se encontraron usuarios')
        }
    }

    @Get('vista/crear')
    crearRolVista(
        @Query() parametrosConsulta,
        @Res() res
    ){
        return res.render('rol/crear',
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
        let respuestaCreacionRol
        const rolCreado = new RolCreateDto()
        rolCreado.nombre = paramBody.nombre


        const errores: ValidationError[] = await validate(rolCreado)
        const texto = `&nombre=${paramBody.nombre}`
        if(errores.length > 0){
            console.error('Errores:',errores);
            const error = 'Error en el formato de los datos'
            return res.redirect('/rol/vista/crear?error='+error+texto)
        } else {

            let error
            const re = /^[\p{L}'][ \p{L}'-]*[\p{L}]$/u;
            if(re.test(paramBody.nombre)) {

                try {
                    respuestaCreacionRol = await this._rolService.crearUno(paramBody)
                } catch (e) {
                    console.error(e)
                    error = 'Error al crear el rol'
                    return res.redirect('/rol/vista/crear?error=' + error + texto)
                }

                if (respuestaCreacionRol) {
                    return res.redirect('/rol/vista/inicio?mensaje=Rol creado exitosamente') // en caso de que all esté OK se envía al inicio
                } else {
                    error = 'Error al crear el Producto'
                    return res.redirect('/rol/vista/crear?error=' + error + texto)
                }
            } else {
                error = 'Caracteres no permitidos en el nombre'
                return res.redirect('/rol/vista/crear?error='+error)
            }

        }

    }


    @Get('vista/editar/:id') // Controlador
    async editarRolVista(
        @Query() parametrosConsulta,
        @Res() res,
        @Param() parametrosRuta
    ) {
        const id = Number(parametrosRuta.id)
        let rolEncontrado

        try {
            rolEncontrado = await this._rolService.buscarUno(id)
        } catch (error) {
            console.error('Error del servidor')
            return res.redirect('/rol/vista/inicio?mensaje=Error buscando rol')
        }

        if (rolEncontrado){
            return res.render(
                'rol/crear',
                {
                    error: parametrosConsulta.error,
                    rol: rolEncontrado
                }
            )
        } else {
            return res.redirect('/rol/vista/inicio?mensaje=Rol no encontrado')
        }
    }


    @Post('editarDesdeVista/:id')
    async editarDesdeVista(
        @Param() parametrosRuta,
        @Body() paramBody,
        @Res() res
    ){

        const rolValidado = new RolUpdateDto()
        rolValidado.id = Number(parametrosRuta.id)
        rolValidado.nombre = paramBody.nombre

        const errores: ValidationError[] = await validate(rolValidado)
        if(errores.length > 0){
            console.error('Errores:',errores);
            return res.redirect('/rol/vista/inicio?mensaje= Error en el formato de los datos')
        } else {

            let error
            const re = /^[\p{L}'][ \p{L}'-]*[\p{L}]$/u;
            if(re.test(paramBody.nombre)) {
                const rolEditado = {
                    rolId: Number(parametrosRuta.id),
                    nombre: paramBody.nombre,
                } as RolEntity

                try {
                    await this._rolService.editarUno(rolEditado)
                    return res.redirect('/rol/vista/inicio?mensaje= Usuario editado correctamente') // en caso de que all esté OK se envía al inicio
                } catch (e) {
                    console.error(e)
                    error = 'Error editando Rol'
                    return res.redirect('/rol/vista/inicio?mensaje=' + error)
                }
            } else {
                error = 'Caracteres no permitidos en el nombre'
                return res.redirect('/rol/vista/crear?error='+error)
            }

        }

    }




    @Post('eliminarDesdeVista/:id')
    async eliminarDesdeVista(
        @Param() paramRuta,
        @Res() res,
    ){
        try{
            await this._rolService.eliminarUno(Number(paramRuta.id))
            return res.redirect('/rol/vista/inicio?mensaje= Rol Eliminado')
        } catch(error){
            console.error(error)
            return res.redirect('/rol/vista/inicio?error=Error eliminando rol')
        }
    }

}
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
import {ProductoService} from "../producto/producto.service";
import {ProductoCreateDto} from "../producto/dto/producto.create-dto";
import {validate, ValidationError} from "class-validator";
import {RolService} from "./rol.service";
import {RolCreateDto} from "./dto/rol.create-dto";
import {UsuarioUpdateDto} from "../usuario/dto/usuario.update-dto";
import {UsuarioEntity} from "../usuario/usuario.entity";
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
        // **************************+ FALTA VER LO DE LA IMAGEN COMO SE GUARDA ****************************


        const errores: ValidationError[] = await validate(rolCreado)
        const texto = `&nombre=${paramBody.nombre}`
        if(errores.length > 0){
            console.error('Errores:',errores);
            const error = 'Error en el formato de los datos'
            return res.redirect('/rol/vista/crear?error='+error+texto)
        } else {
            try {
                respuestaCreacionRol = await this._rolService.crearUno(paramBody)
            } catch (e){
                console.error(e)
                const errorCreacion = 'Error al crear el rol'
                return res.redirect('/rol/vista/crear?error='+errorCreacion+texto)
            }

            if(respuestaCreacionRol){
                return res.redirect('/rol/vista/inicio?mensaje=Rol creado exitosamente') // en caso de que all esté OK se envía al inicio
            } else {
                const errorCreacion = 'Error al crear el Producto'
                return res.redirect('/rol/vista/crear?error='+errorCreacion+texto)
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

            const rolEditado = {
                rolId: Number(parametrosRuta.id),
                nombre: paramBody.nombre,
            } as RolEntity

            try {
                await this._rolService.editarUno(rolEditado)
                return res.redirect('/rol/vista/inicio?mensaje= Usuario editado correctamente') // en caso de que all esté OK se envía al inicio
            } catch (e){
                console.error(e)
                const errorCreacion = 'Error editando Rol'
                return res.redirect('/rol/vista/inicio?mensaje='+errorCreacion)
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
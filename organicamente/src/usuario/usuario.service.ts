import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {UsuarioEntity} from "./usuario.entity";
import {FindManyOptions, Repository} from "typeorm";

@Injectable()
export class  UsuarioService {

    constructor(
        @InjectRepository(UsuarioEntity)
        private repositorio: Repository<UsuarioEntity>
    ) {
    }

    crearUno(nuevoUsuario: UsuarioEntity){
        return this.repositorio.save(nuevoUsuario) // promesa
    }

    buscarTodos(){
        return this.repositorio.find()
    }

    buscarUno(id: number){
        return this.repositorio.findOne(id)
    }

    editarUno(usuarioEditado:UsuarioEntity){
        return this.repositorio.save(usuarioEditado)
    }

    eliminarUno(id:number){
        return this.repositorio.delete(id)
    }

    validarLogin(user:string, pswd: string){

        let busquedaEjemplo: FindManyOptions<UsuarioEntity>

        busquedaEjemplo = {
            where: [
                {
                    email: user, // AND
                    password: pswd,
                },
                {
                    username: user,
                    password: pswd,

                }
            ]
        }

        return this.repositorio.find(busquedaEjemplo)
    }



}


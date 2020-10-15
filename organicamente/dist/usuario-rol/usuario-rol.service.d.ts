import { Repository } from "typeorm/index";
import { UsuarioRolEntity } from "./usuario-rol.entity";
export declare class UsuarioRolService {
    private repositorio;
    constructor(repositorio: Repository<UsuarioRolEntity>);
    crearUno(usuarioRol: UsuarioRolEntity): Promise<UsuarioRolEntity>;
    buscarTodos(): Promise<UsuarioRolEntity[]>;
    buscarUno(id: number): Promise<UsuarioRolEntity>;
    buscarRolesUnUsuario(usuarioId: number): Promise<any>;
    editarUno(usuarioRolEditado: UsuarioRolEntity): Promise<UsuarioRolEntity>;
    eliminarUno(id: number): Promise<any>;
}

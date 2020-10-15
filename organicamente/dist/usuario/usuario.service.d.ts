import { UsuarioEntity } from "./usuario.entity";
import { Repository } from "typeorm";
export declare class UsuarioService {
    private repositorio;
    constructor(repositorio: Repository<UsuarioEntity>);
    crearUno(nuevoUsuario: UsuarioEntity): Promise<UsuarioEntity>;
    buscarTodos(textoBusqueda: string): Promise<UsuarioEntity[]>;
    buscarUno(id: number): Promise<UsuarioEntity>;
    editarUno(usuarioEditado: UsuarioEntity): Promise<UsuarioEntity>;
    eliminarUno(id: number): Promise<import("typeorm").DeleteResult>;
    validarLogin(user: string, pswd: string): Promise<UsuarioEntity[]>;
    emailRegistrado(email: string): Promise<UsuarioEntity[]>;
    usernameRegistrado(username: string): Promise<UsuarioEntity[]>;
}

import { Repository } from "typeorm/index";
import { UsuarioProductoEntity } from "./usuario-producto.entity";
export declare class UsuarioProductoService {
    private repositorio;
    constructor(repositorio: Repository<UsuarioProductoEntity>);
    crearUno(usuarioProducto: UsuarioProductoEntity): Promise<UsuarioProductoEntity>;
    buscarTodos(): Promise<UsuarioProductoEntity[]>;
    buscarUno(id: number): Promise<UsuarioProductoEntity>;
    buscarEspecificosProductor(id: number): Promise<UsuarioProductoEntity[]>;
    busquedaProductoCamposClienteAdmin(busqueda: string): Promise<any>;
    busquedaProductoCamposProductor(busqueda: string, id: number): Promise<any>;
    editarUno(usuarioProductoEditado: UsuarioProductoEntity): Promise<UsuarioProductoEntity>;
    eliminarUno(id: number): Promise<import("typeorm").DeleteResult>;
}

import { Repository } from "typeorm/index";
import { RolEntity } from "./rol.entity";
export declare class RolService {
    private repositorio;
    constructor(repositorio: Repository<RolEntity>);
    crearUno(rol: RolEntity): Promise<RolEntity>;
    buscarTodos(): Promise<RolEntity[]>;
    buscarUno(id: number): Promise<RolEntity>;
    buscarUnoNombre(nombre: string): Promise<RolEntity>;
    editarUno(rolEditado: RolEntity): Promise<RolEntity>;
    eliminarUno(id: number): Promise<import("typeorm").DeleteResult>;
}

import { Repository } from "typeorm/index";
import { UnidadEntity } from "./unidad.entity";
export declare class UnidadService {
    private repositorio;
    constructor(repositorio: Repository<UnidadEntity>);
    crearUno(unidad: UnidadEntity): Promise<UnidadEntity>;
    buscarTodos(): Promise<UnidadEntity[]>;
    buscarUno(id: number): Promise<UnidadEntity>;
    editarUno(unidadEditada: UnidadEntity): Promise<UnidadEntity>;
    eliminarUno(id: number): Promise<import("typeorm").DeleteResult>;
}

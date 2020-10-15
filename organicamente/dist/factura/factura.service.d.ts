import { Repository } from "typeorm/index";
import { FacturaEntity } from "./factura.entity";
export declare class FacturaService {
    private repositorio;
    constructor(repositorio: Repository<FacturaEntity>);
    crearUno(nuevaFactura: FacturaEntity): Promise<FacturaEntity>;
    buscarTodos(busqueda: string): Promise<any>;
    buscarTodosUnUsuario(id: number, busqueda: string): Promise<any>;
    buscarFacturasEspecificas(id: number, busqueda: string): Promise<any>;
    buscarUno(id: number): Promise<any>;
    editarUno(facturaEditada: FacturaEntity): Promise<FacturaEntity>;
    eliminarUno(id: number): Promise<import("typeorm").DeleteResult>;
}

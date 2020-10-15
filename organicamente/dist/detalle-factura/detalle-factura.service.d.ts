import { DetalleFacturaEntity } from "./detalle-factura.entity";
import { Repository } from "typeorm/index";
export declare class DetalleFacturaService {
    private repositorio;
    constructor(repositorio: Repository<DetalleFacturaEntity>);
    crearUno(nuevoDetalleFactura: DetalleFacturaEntity): Promise<DetalleFacturaEntity>;
    buscarTodos(id: number): Promise<any>;
    buscarUno(id: number): Promise<DetalleFacturaEntity>;
    editarUno(detalleFacturaEditado: DetalleFacturaEntity): Promise<DetalleFacturaEntity>;
}

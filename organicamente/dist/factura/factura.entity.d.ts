import { DetalleFacturaEntity } from "../detalle-factura/detalle-factura.entity";
import { UsuarioEntity } from "../usuario/usuario.entity";
export declare class FacturaEntity {
    facturaId: number;
    total: number;
    fecha: string;
    cumplido: string;
    detallesFacturas: DetalleFacturaEntity[];
    usuario: UsuarioEntity;
}

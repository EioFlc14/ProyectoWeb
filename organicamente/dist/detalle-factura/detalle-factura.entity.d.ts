import { UsuarioProductoEntity } from "../usuario-producto/usuario-producto.entity";
import { FacturaEntity } from "../factura/factura.entity";
export declare class DetalleFacturaEntity {
    detalleFacturaId: number;
    cantidad: number;
    precio: number;
    valor: number;
    usuarioProducto: UsuarioProductoEntity;
    factura: FacturaEntity;
}

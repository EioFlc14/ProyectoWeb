import { ProductoEntity } from "../producto/producto.entity";
import { UnidadEntity } from "../unidad/unidad.entity";
import { DetalleFacturaEntity } from "../detalle-factura/detalle-factura.entity";
import { UsuarioEntity } from "../usuario/usuario.entity";
export declare class UsuarioProductoEntity {
    usuarioProductoId: number;
    stock: number;
    precio: number;
    imagen?: string;
    producto: ProductoEntity;
    unidad: UnidadEntity;
    detallesFacturas: DetalleFacturaEntity[];
    usuario: UsuarioEntity;
}

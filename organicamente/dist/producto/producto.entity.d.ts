import { UsuarioProductoEntity } from "../usuario-producto/usuario-producto.entity";
export declare class ProductoEntity {
    productoId: number;
    nombre: string;
    usuarioProductos: UsuarioProductoEntity[];
}

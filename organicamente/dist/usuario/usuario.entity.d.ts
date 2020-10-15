import { FacturaEntity } from "../factura/factura.entity";
import { UsuarioRolEntity } from "../usuario-rol/usuario-rol.entity";
import { UsuarioProductoEntity } from "../usuario-producto/usuario-producto.entity";
export declare class UsuarioEntity {
    usuarioId: number;
    nombre: string;
    apellido?: string;
    username: string;
    password: string;
    email: string;
    telefono: string;
    direccion: string;
    identificacion: string;
    facturas: FacturaEntity[];
    usuariosRoles: UsuarioRolEntity[];
    usuariosProductos: UsuarioProductoEntity[];
}

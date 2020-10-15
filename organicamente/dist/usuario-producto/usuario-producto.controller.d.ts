import { UsuarioProductoService } from "./usuario-producto.service";
import { ProductoService } from "../producto/producto.service";
import { UnidadService } from "../unidad/unidad.service";
export declare class UsuarioProductoController {
    private readonly _usuarioProductoService;
    private readonly _productoService;
    private readonly _unidadService;
    constructor(_usuarioProductoService: UsuarioProductoService, _productoService: ProductoService, _unidadService: UnidadService);
    obtenerUsuarioProductos(parametrosRuta: any, parametrosConsulta: any, res: any, session: any): Promise<any>;
    crearUsuarioProductoVista(parametrosConsulta: any, res: any, session: any): Promise<any>;
    crearDesdeVista(paramBody: any, res: any, req: any, file: any, session: any): Promise<any>;
    editarUsuarioProductoVista(parametrosConsulta: any, res: any, parametrosRuta: any, session: any): Promise<any>;
    editarDesdeVista(parametrosRuta: any, paramBody: any, res: any, file: any, session: any): Promise<any>;
}

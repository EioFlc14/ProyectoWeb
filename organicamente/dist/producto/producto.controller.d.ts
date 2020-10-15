import { ProductoService } from "./producto.service";
export declare class ProductoController {
    private readonly _productoService;
    constructor(_productoService: ProductoService);
    obtenerProductos(res: any, parametrosConsulta: any, session: any): Promise<any>;
    crearProductoVista(parametrosConsulta: any, res: any, session: any): any;
    crearDesdeVista(paramBody: any, res: any, session: any): Promise<any>;
    editarProductoVista(parametrosConsulta: any, res: any, parametrosRuta: any, session: any): Promise<any>;
    editarDesdeVista(parametrosRuta: any, paramBody: any, res: any, session: any): Promise<any>;
}

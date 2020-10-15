import { FacturaService } from "./factura.service";
import { UsuarioProductoService } from "../usuario-producto/usuario-producto.service";
import { DetalleFacturaService } from "../detalle-factura/detalle-factura.service";
export declare class FacturaController {
    private readonly _facturaService;
    private readonly _usuarioProductoService;
    private readonly _detalleFacturaService;
    constructor(_facturaService: FacturaService, _usuarioProductoService: UsuarioProductoService, _detalleFacturaService: DetalleFacturaService);
    obtenerFacturasUnUsuario(res: any, paramRuta: any, parametrosConsulta: any, session: any): Promise<any>;
    crearFacturaVista(parametrosBody: any, parametrosConsulta: any, res: any, session: any): Promise<any>;
    crearDesdeVista(paramBody: any, paramConsulta: any, res: any, session: any): Promise<any>;
    editarFacturaVista(parametrosConsulta: any, res: any, parametrosRuta: any, session: any): Promise<any>;
    editarDesdeVista(parametrosRuta: any, paramBody: any, res: any, session: any): Promise<any>;
}

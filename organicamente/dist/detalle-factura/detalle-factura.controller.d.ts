import { DetalleFacturaService } from "./detalle-factura.service";
import { UsuarioService } from "../usuario/usuario.service";
export declare class DetalleFacturaController {
    private readonly _detalleFacturaService;
    private readonly _usuarioService;
    constructor(_detalleFacturaService: DetalleFacturaService, _usuarioService: UsuarioService);
}

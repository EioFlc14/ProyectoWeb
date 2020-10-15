import { UnidadService } from "./unidad.service";
export declare class UnidadController {
    private readonly _unidadService;
    constructor(_unidadService: UnidadService);
    obtenerUnidades(paramConsulta: any, res: any, session: any): Promise<any>;
    crearDesdeVista(paramBody: any, res: any, session: any): Promise<any>;
}

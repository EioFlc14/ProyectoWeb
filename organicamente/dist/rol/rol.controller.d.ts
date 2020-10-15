import { RolService } from "./rol.service";
export declare class RolController {
    private readonly _rolService;
    constructor(_rolService: RolService);
    obtenerUnidades(paramConsulta: any, res: any, session: any): Promise<any>;
    crearDesdeVista(paramBody: any, res: any, session: any): Promise<any>;
}

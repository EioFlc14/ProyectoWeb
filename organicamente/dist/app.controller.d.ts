import { AppService } from './app.service';
import { UsuarioService } from "./usuario/usuario.service";
import { RolService } from "./rol/rol.service";
import { UsuarioRolService } from "./usuario-rol/usuario-rol.service";
export declare class AppController {
    private readonly appService;
    private readonly _usuarioService;
    private readonly _rolService;
    private readonly _usuarioRolService;
    constructor(appService: AppService, _usuarioService: UsuarioService, _rolService: RolService, _usuarioRolService: UsuarioRolService);
    login(paramConsulta: any, res: any, session: any): any;
    principal(paramConsulta: any, res: any, session: any): any;
    loginDesdeVista(paramBody: any, res: any, session: any): Promise<any>;
    registro(parametrosConsulta: any, res: any): any;
    registroDesdeVista(paramBody: any, res: any): Promise<any>;
    cerrarSesion(session: any, res: any, req: any): any;
}

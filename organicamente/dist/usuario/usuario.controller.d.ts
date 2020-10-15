import { UsuarioService } from "./usuario.service";
import { RolService } from "../rol/rol.service";
import { UsuarioRolService } from "../usuario-rol/usuario-rol.service";
export declare class UsuarioController {
    private readonly _usuarioService;
    private readonly _rolService;
    private readonly _usuarioRolService;
    constructor(_usuarioService: UsuarioService, _rolService: RolService, _usuarioRolService: UsuarioRolService);
    obtenerUsuarios(res: any, parametrosConsulta: any, session: any): Promise<any>;
    crearUsuarioVista(parametrosConsulta: any, res: any, session: any): any;
    crearDesdeVista(paramBody: any, res: any, session: any): Promise<any>;
    editarUsuarioVista(parametrosConsulta: any, parametrosRuta: any, res: any, session: any): Promise<any>;
    editarUsuarioVistaMiCuenta(parametrosConsulta: any, parametrosRuta: any, res: any, session: any): Promise<any>;
    editarDesdeVista(parametrosRuta: any, paramBody: any, res: any, session: any): Promise<any>;
    cambiarContrasena(parametrosConsulta: any, res: any, parametrosRuta: any, session: any): any;
    cambiarContrasenaMiCuenta(parametrosConsulta: any, res: any, session: any): any;
    cambiarContrasenaDesdeVista(paramBody: any, res: any, parametrosRuta: any, session: any): Promise<any>;
}

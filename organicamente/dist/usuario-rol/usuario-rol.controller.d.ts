import { UsuarioRolService } from "./usuario-rol.service";
import { UsuarioService } from "../usuario/usuario.service";
import { RolService } from "../rol/rol.service";
export declare class UsuarioRolController {
    private readonly _usuarioRolService;
    private readonly _usuarioService;
    private readonly _rolService;
    constructor(_usuarioRolService: UsuarioRolService, _usuarioService: UsuarioService, _rolService: RolService);
}

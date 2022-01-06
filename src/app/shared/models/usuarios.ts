export interface IUsuarioInfo {
    IdUsuario?: number;
    Usuario: string;
    TipoUsuario: any;
    Division: any;
    Token?: string;
}

export interface IUsuario {
    IdUsuario?: number;
    Usuario: string;
    IdTipoUsuario: number;
    IdDivision: number;
    Division?: any;
    Contrasena?: string;
    ContrasenaAvanzada?: string;
    CambiarContrasena: boolean;
    Token?: string;
}

export class Usuario {
    IdUsuario?: number;
    Usuario: string;
    IdTipoUsuario: number;
    IdDivision: number;
    CambiarContrasena: boolean;
    Token?: string;

    constructor(usuarioInfo: IUsuario | object) {
        Object.assign(this, usuarioInfo);
    }
}

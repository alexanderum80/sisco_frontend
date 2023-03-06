export interface IChat {
  idUser: number;
  user: string;
  text: string;
}

export interface IUsuariosChat {
  IdDivision?: string;
  IdUsuario?: string;
  Usuario: string;
  Conectado: boolean;
}

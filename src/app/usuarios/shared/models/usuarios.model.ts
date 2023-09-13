import { IUsuario } from '../../../shared/models/usuarios';
import { ISelectableOptions } from '../../../shared/models/selectable-item';

interface IUsuarioQueryResponse {
  success: boolean;
  data: IUsuario;
  error: string;
}

interface IUsuariosQueryResponse {
  success: boolean;
  data: IUsuario[];
  error: string;
}

interface IUsuariosMutationResponse {
  success: boolean;
  error: string;
}

export interface UsuariosQueryResponse {
  authenticateUsuario: IUsuario;
  getAllUsuarios: IUsuariosQueryResponse;
  getUsuariosByIdDivision: IUsuariosQueryResponse;
  getUsuarioById: IUsuarioQueryResponse;
}

export interface UsuariosMutationResponse {
  createUsuario: IUsuariosMutationResponse;
  updateUsuario: IUsuariosMutationResponse;
  deleteUsuario: IUsuariosMutationResponse;
  changePassword: IUsuariosMutationResponse;
}

export const TipoUsuarios: ISelectableOptions[] = [
  { value: 1, description: 'Administrador' },
  { value: 2, description: 'Usuario' },
  { value: 3, description: 'Usuario Avanzado' },
  { value: 4, description: 'Financista' },
];

export enum ETipoUsuarios {
  'Administrador' = 1,
  'Usuario' = 2,
  'Usuario Avanzado' = 3,
  'Financista' = 4,
  'Supervisión' = 5,
}

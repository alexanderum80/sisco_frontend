import { IDivisiones } from 'src/app/shared/models';
import { IMutationResponse } from '../../../shared/models/mutation-response';
import { IQueryResponse } from '../../../shared/models/query-response';

export interface IEntidadesRodas {
  sigla: string;
  entidad: string;
}

export interface IConexionesRodas {
  Id: number;
  IdUnidad: number;
  Unidad: any;
  Consolidado: boolean;
  IdDivision: number;
  Division: IDivisiones;
  IpRodas: string;
  BaseDatos: string;
  FechaActualizacion?: Date;
}

export interface ConexionRodasQueryResponse {
  getAllContaConexiones: IConexionesRodas[];
  getContaConexionById: IConexionesRodas;
  estadoContaConexiones: IQueryResponse;
  entidadesRodas: IEntidadesRodas[];
}

export interface ConexionRodasMutationResponse {
  createContaConexion: IMutationResponse;
  updateContaConexion: IMutationResponse;
  deleteContaConexion: IMutationResponse;
}

import { IMutationResponse } from '../../../shared/models/mutation-response';
import { IQueryResponse } from '../../../shared/models/query-response';

export interface IEntidadesRodas {
  sigla: string;
  entidad: string;
}

export interface ConexionRodasQueryResponse {
  getAllContaConexiones: IQueryResponse;
  getContaConexionById: IQueryResponse;
  estadoContaConexiones: IQueryResponse;
  entidadesRodas: IEntidadesRodas[];
}

export interface ConexionRodasMutationResponse {
  createContaConexion: IMutationResponse;
  updateContaConexion: IMutationResponse;
  deleteContaConexion: IMutationResponse;
}

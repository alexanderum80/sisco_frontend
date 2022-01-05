import { IMutationResponse } from '../../../shared/models/mutation-response';
import { IQueryResponse } from '../../../shared/models/query-response';

export interface ConexionRodasQueryResponse {
    getAllContaConexiones: IQueryResponse;
    getContaConexionesByDivision: IQueryResponse;
    getContaConexionById: IQueryResponse;
    estadoContaConexiones: IQueryResponse;
}

export interface ConexionRodasMutationResponse {
    saveContaConexion: IMutationResponse;
    deleteContaConexion: IMutationResponse;
}


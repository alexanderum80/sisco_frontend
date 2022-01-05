import { IQueryResponse } from './../../../shared/models/query-response';
import { IMutationResponse } from './../../../shared/models/mutation-response';

export interface ConexionDWHQueryResponse {
    getDWHConexion: IQueryResponse;
}

export interface ConexionDWHMutationResponse {
    updateDWhConexion: IMutationResponse;
}

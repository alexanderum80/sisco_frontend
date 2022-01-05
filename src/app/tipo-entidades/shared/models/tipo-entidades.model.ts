import { IMutationResponse } from './../../../shared/models/mutation-response';
import { IQueryResponse } from './../../../shared/models/query-response';

export interface TipoEntidadesQueryResponse {
    getAllTipoEntidades: IQueryResponse;
    getTipoEntidadById: IQueryResponse;
}

export interface TipoEntidadesMutationResponse {
    saveTipoEntidad: IMutationResponse;
    deleteTipoEntidad: IMutationResponse;
}

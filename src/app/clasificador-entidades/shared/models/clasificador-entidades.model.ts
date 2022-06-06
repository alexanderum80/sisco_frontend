import { IMutationResponse } from './../../../shared/models/mutation-response';
import { IQueryResponse } from './../../../shared/models/query-response';

export interface ClasificadorEntidadesQueryResponse {
  getAllClasificadorEntidades: IQueryResponse;
  getClasificadorEntidad: IQueryResponse;
}

export interface ClasificadorEntidadesMutationResponse {
  createClasificadorEntidad: IMutationResponse;
  updateClasificadorEntidad: IMutationResponse;
  deleteClasificadorEntidad: IMutationResponse;
}

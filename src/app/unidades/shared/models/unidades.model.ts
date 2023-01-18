import { IQueryResponse } from './../../../shared/models/query-response';

export interface UnidadesQueryResponse {
  getAllUnidades: IQueryResponse;
  getAllUnidadesByUsuario: IQueryResponse;
  getUnidadesByIdSubdivision: IQueryResponse;
  getUnidadesByIdDivision: IQueryResponse;
}

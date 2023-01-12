import { IQueryResponse } from './query-response';

export interface DivisionesQueryResponse {
  getAllDivisiones: IQueryResponse;
  getAllDivisionesByUsuario: IQueryResponse;
  getDivisionById: IQueryResponse;
}

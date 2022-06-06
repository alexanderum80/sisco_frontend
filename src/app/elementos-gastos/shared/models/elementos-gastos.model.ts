import { IMutationResponse } from './../../../shared/models/mutation-response';
import { IQueryResponse } from './../../../shared/models/query-response';

export interface ElementosGastosQueryResponse {
  getAllElementosGastos: IQueryResponse;
  getElementoGastoById: IQueryResponse;
}

export interface ElementosGastosMutationResponse {
  saveElementoGasto: IMutationResponse;
  deleteElementoGasto: IMutationResponse;
}

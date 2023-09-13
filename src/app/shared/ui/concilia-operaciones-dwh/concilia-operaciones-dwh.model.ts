import { IQueryResponse } from '../../models/query-response';

export interface ConciliaOperacionesDWHQueryResponse {
  conciliaInternaDWH: IQueryResponse;
  conciliaExternaDWH: IQueryResponse;
}

import { IQueryResponse } from './../../../shared/models/query-response';

export interface UnidadesQueryResponse {
    getAllUnidades: IQueryResponse;
    getUnidadesByIdSubdivision: IQueryResponse;
    getUnidadesByIdDivision: IQueryResponse;
}

import { IMutationResponse } from 'src/app/shared/models';
import { IQueryResponse } from '../../../shared/models/query-response';

export interface ConciliaContabilidadQueryResponse {
    conciliaContabilidad: IQueryResponse;
}

export interface ConciliaContabilidadMutationReponse {
    iniciarSaldos: IMutationResponse;
    chequearCentros: IMutationResponse;
}


import { IMutationResponse } from './../../../shared/models/mutation-response';
import { IQueryResponse } from './../../../shared/models/query-response';

export interface ClasificadorCuentasQueryResponse {
    getAllClasificadorCuentas: IQueryResponse;
    getClasificadorCuenta: IQueryResponse;
    getCuentasAgrupadas: IQueryResponse;
}

export interface ClasificadorCuentasMutationResponse {
    saveClasificadorCuenta: IMutationResponse;
    deleteClasificadorCuenta: IMutationResponse;
}

export enum TiposClasificadorCuenta {
    'Consolidado' = 1,
    'Centro' = 2,
    'Complejo' = 3
}

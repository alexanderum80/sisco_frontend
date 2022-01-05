import { IMutationResponse } from './../../../shared/models/mutation-response';
import { IQueryResponse } from './../../../shared/models/query-response';

export interface EpigrafesQueryResponse {
    getAllEpigrafes: IQueryResponse;
    getEpigrafeById: IQueryResponse;
}

export interface EpigrafesMutationResponse {
    saveEpigrafe: IMutationResponse;
    deleteEpigrafe: IMutationResponse;
}

import { IMutationResponse } from './../../../shared/models/mutation-response';

export interface IEpigrafes {
  IdEpigrafe: number;
  Epigrafe: string;
}

export interface EpigrafesQueryResponse {
  getAllEpigrafes: IEpigrafes[];
  getEpigrafeById: IEpigrafes;
}

export interface EpigrafesMutationResponse {
  createEpigrafe: IMutationResponse;
  updateEpigrafe: IMutationResponse;
  deleteEpigrafe: IMutationResponse;
}

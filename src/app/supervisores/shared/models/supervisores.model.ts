import { IMutationResponse } from './../../../shared/models/mutation-response';

interface ISupervisoresInfo {
  IdSupervisor: number;
  Supervisor: string;
  Cargo: any;
  Division: any;
}

export interface ISupervisor {
  IdSupervisor: number;
  Supervisor: string;
  IdCargo: number;
  IdDivision: number;
}

interface ISupervisorQueryResponse {
  success: boolean;
  data: ISupervisoresInfo;
  error: string;
}

interface ISupervisoresQueryResponse {
  success: boolean;
  data: ISupervisoresInfo[];
  error: string;
}

export interface SupervisoresQueryResponse {
  getAllSupervisores: ISupervisoresQueryResponse;
  getSupervisorById: ISupervisorQueryResponse;
}

export interface SupervisoresMutationResponse {
  createSupervisor: IMutationResponse;
  updateSupervisor: IMutationResponse;
  deleteSupervisor: IMutationResponse;
}

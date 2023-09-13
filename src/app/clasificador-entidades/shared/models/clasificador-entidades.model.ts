import { IMutationResponse } from './../../../shared/models/mutation-response';

export interface IClasificarEntidades {
  IdUnidad: number;
  Unidad: string;
  IdTipoEntidad: number;
  TipoEntidad: string;
  Division: string;
  SubDivision: string;
}

export interface ClasificadorEntidadesQueryResponse {
  getAllClasificadorEntidades: IClasificarEntidades[];
  getClasificadorEntidad: IClasificarEntidades;
}

export interface ClasificadorEntidadesMutationResponse {
  createClasificadorEntidad: IMutationResponse;
  updateClasificadorEntidad: IMutationResponse;
  deleteClasificadorEntidad: IMutationResponse;
}

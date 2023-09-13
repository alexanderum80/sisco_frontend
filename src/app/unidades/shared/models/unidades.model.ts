import { IQueryResponse } from './../../../shared/models/query-response';

export interface IUnidades {
  IdUnidad: number;
  Nombre: string;
  IdComplejo?: number;
  IdSubdivision: number;
  Subdivision?: string;
  IdDivision: number;
  Division?: string;
  Provincia?: string;
  Tipo?: number;
  Abierta?: boolean;
}

export interface UnidadesQueryResponse {
  getAllUnidades: IUnidades[];
  getAllUnidadesByUsuario: IUnidades[];
  getUnidadesByIdSubdivision: IUnidades[];
  getUnidadesByIdDivision: IUnidades[];
}

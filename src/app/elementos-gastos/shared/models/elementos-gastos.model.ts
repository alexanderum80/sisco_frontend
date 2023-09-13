import { IMutationResponse } from './../../../shared/models/mutation-response';

export interface IElementosGastos {
  Egasto: string;
  Descripcion: string;
  UsoContenido: string;
  TipoEntidad: string;
  CuentaAsociada: string;
  IdEpigrafe: number;
}

export interface ElementosGastosQueryResponse {
  getAllElementosGastos: IElementosGastos[];
  getElementoGastoById: IElementosGastos;
}

export interface ElementosGastosMutationResponse {
  saveElementoGasto: IMutationResponse;
  deleteElementoGasto: IMutationResponse;
}

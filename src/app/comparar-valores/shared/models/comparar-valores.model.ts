import { IMutationResponse } from './../../../shared/models/mutation-response';

interface IComprobarValores {
  Id: number;
  IdCentro: number;
  Centro: string;
  IdExpresion: number;
  Expresion: string;
  IdOperador: number;
  Operador: string;
  Valor: number;
  IdDivision?: number;
  Consolidado: boolean;
  Activo: boolean;
}

export interface ComprobarValoresQueryResponse {
  getAllComprobarValores: IComprobarValores[];
  getComprobarValorById: IComprobarValores;
}

export interface ComprobarValoresMutation {
  createComprobarValor: IMutationResponse;
  updateComprobarValor: IMutationResponse;
  deleteComprobarValor: IMutationResponse;
}

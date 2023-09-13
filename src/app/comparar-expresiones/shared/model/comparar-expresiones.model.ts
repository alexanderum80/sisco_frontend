import { IMutationResponse } from './../../../shared/models/mutation-response';

interface IComprobarExpresiones {
  Id: number;
  IdExpresion: number;
  IdOperador: string;
  IdExpresionC: number;
  Centro: boolean;
  Complejo: boolean;
  Con: boolean;
  Centralizada: boolean;
  IdDivision: number;
  Expresion?: any;
  ExpresionC?: any;
  Operador?: any;
}

export interface ComprobarExpresionesQueryResponse {
  getAllComprobarExpresiones: IComprobarExpresiones[];
  getComprobarExpresionById: IComprobarExpresiones;
}

export interface ComprobarExpresionesMutation {
  createComprobarExpresion: IMutationResponse;
  updateComprobarExpresion: IMutationResponse;
  deleteComprobarExpresion: IMutationResponse;
}

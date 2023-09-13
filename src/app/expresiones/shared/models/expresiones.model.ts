import { IMutationResponse } from './../../../shared/models/mutation-response';

interface ITipoValorExpresiones {
  IdTipoValor: number;
  Valor: string;
}

interface IExpresionResumen {
  IdExpresion: number;
  Expresion: string;
  Descripcion: string;
  Acumulado: boolean;
  OperacionesInternas: boolean;
  Centralizada: boolean;
  IdDivision: number;
}

interface IExpresionDetalle {
  id: number;
  IdExpresion: number;
  Cta: string;
  SubCta: string;
  Crit1: string;
  Crit2: string;
  Crit3: string;
  Signo: string;
  PorCiento: number;
  TipoValor: number;
  TipoValorDesc?: string;
}

export interface ExpresionesQueryResponse {
  getAllExpresionesResumen: IExpresionResumen[];
  getAllContaTipoValorExpresiones: ITipoValorExpresiones[];
  getExpresionResumenById: IExpresionResumen;
  getExpresionesDetalleByIdResumen: IExpresionDetalle[];
}

export interface ExpresionesMutationResponse {
  createExpresion: IMutationResponse;
  updateExpresion: IMutationResponse;
  deleteExpresionResumen: IMutationResponse;
}

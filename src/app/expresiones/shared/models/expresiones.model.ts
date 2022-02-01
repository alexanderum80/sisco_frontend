import { IMutationResponse } from './../../../shared/models/mutation-response';

interface ITipoValorExpresiones {
    IdTipoValor: number;
    Valor: string;
}

interface ITipoValorExpresionesQueryResponse {
    success: boolean;
    data: ITipoValorExpresiones[];
    error?: string;
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

interface IExpresionResumenQueryResponse {
    success: boolean;
    data: IExpresionResumen;
    error?: string;
}

interface IExpresionesResumenQueryResponse {
    success: boolean;
    data: IExpresionResumen[];
    error?: string;
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

interface IExpresionDetalleQueryResponse {
    success: boolean;
    data: IExpresionDetalle;
    error?: string;
}

interface IExpresionesDetalleQueryResponse {
    success: boolean;
    data: IExpresionDetalle[];
    error?: string;
}

export interface ExpresionesQueryResponse {
    getAllExpresionesResumen: IExpresionesResumenQueryResponse;
    getAllContaTipoValorExpresiones: ITipoValorExpresionesQueryResponse;
    getExpresionResumenById: IExpresionResumenQueryResponse;
    getExpresionesDetalleByIdResumen: IExpresionesDetalleQueryResponse;
}

export interface ExpresionesMutationResponse {
    createExpresion: IMutationResponse;
    updateExpresion: IMutationResponse;
    deleteExpresionResumen: IMutationResponse;
}

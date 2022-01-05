import { IMutationResponse } from './../../../shared/models/mutation-response';

interface IComprobarExpresiones {
    Id: number;
    Expresion: number;
    Operador: string;
    ExpresionC: number;
    Centro: boolean;
    Complejo: boolean;
    Con: boolean;
    ExpresionDesc?: string;
    ExpresionDesc_C?: string;
    OperadorDesc?: string;
}

interface IComprobarExpresionQueryResponse {
    success: boolean;
    data: IComprobarExpresiones;
    error?: string;
}

interface IComprobarExpresionesQueryResponse {
    success: boolean;
    data: IComprobarExpresiones[];
    error?: string;
}

export interface ComprobarExpresionesQueryResponse {
    getAllComprobarExpresiones: IComprobarExpresionesQueryResponse;
    getComprobarExpresionById: IComprobarExpresionQueryResponse;
}

export interface ComprobarExpresionesMutation {
    saveComprobarExpresion: IMutationResponse;
    deleteComprobarExpresion: IMutationResponse;
}

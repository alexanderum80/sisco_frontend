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
    createComprobarExpresion: IMutationResponse;
    updateComprobarExpresion: IMutationResponse;
    deleteComprobarExpresion: IMutationResponse;
}

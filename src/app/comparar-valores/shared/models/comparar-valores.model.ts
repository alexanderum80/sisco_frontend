import { IMutationResponse } from './../../../shared/models/mutation-response';

interface IComprobarValores {
    Id: number;
    IdCentro: number;
    Centro: string;
    IdExpresion: number;
    Expresion: string;
    IdOperador: number;
    Operador: string
    Valor: number;
    IdDivision?: number;
}

interface IComprobarValorQueryResponse {
    success: boolean;
    data: IComprobarValores;
    error?: string;
}

interface IComprobarValoresQueryResponse {
    success: boolean;
    data: IComprobarValores[];
    error?: string;
}

export interface ComprobarValoresQueryResponse {
    getAllComprobarValores: IComprobarValoresQueryResponse;
    getComprobarValorById: IComprobarValorQueryResponse;
}

export interface ComprobarValoresMutation {
    createComprobarValor: IMutationResponse;
    updateComprobarValor: IMutationResponse;
    deleteComprobarValor: IMutationResponse;
}

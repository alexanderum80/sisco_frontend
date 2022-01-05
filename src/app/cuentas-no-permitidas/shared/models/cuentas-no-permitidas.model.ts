import { IMutationResponse } from '../../../shared/models/mutation-response';

interface ICuentasNoPermitidas {
    Id: number;
    Codigo: string;
    Cta: string;
    SubCta: string;
    Crit1: string;
    Crit2: string;
    Crit3: string;
}

interface ICuentaNoPermitidaQueryResponse {
    success: boolean;
    data: ICuentasNoPermitidas;
    error?: string;
}

interface ICuentasNoPermitidasQueryResponse {
    success: boolean;
    data: ICuentasNoPermitidas[];
    error?: string;
}

export interface CuentasNoPermitidasQueryResponse {
    getAllNoUsarEnCuenta: ICuentasNoPermitidasQueryResponse;
    getNoUsarEnCuentaById: ICuentaNoPermitidaQueryResponse;
}

export interface CuentasNoPermitidasMutation {
    saveNoUsarEnCuenta: IMutationResponse;
    deleteNoUsarEnCuenta: IMutationResponse;
}

import { IMutationResponse } from '../../../shared/models/mutation-response';

interface ICuentasNoPermitidas {
  Id: number;
  Codigo: string;
  Cta: string;
  SubCta: string;
  Crit1: string;
  Crit2: string;
  Crit3: string;
  Centralizada: boolean;
  IdDivision: number;
}

interface ICuentaNoPermitidaQueryResponse {
  success: boolean;
  data: ICuentasNoPermitidas;
  error: string;
}

interface ICuentasNoPermitidasQueryResponse {
  success: boolean;
  data: ICuentasNoPermitidas[];
  error: string;
}

export interface CuentasNoPermitidasQueryResponse {
  getAllNoUsarEnCuenta: ICuentasNoPermitidasQueryResponse;
  getNoUsarEnCuentaById: ICuentaNoPermitidaQueryResponse;
}

export interface CuentasNoPermitidasMutation {
  createNoUsarEnCuenta: IMutationResponse;
  updateNoUsarEnCuenta: IMutationResponse;
  deleteNoUsarEnCuenta: IMutationResponse;
}

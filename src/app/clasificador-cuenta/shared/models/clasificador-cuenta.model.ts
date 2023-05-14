import { IMutationResponse } from './../../../shared/models/mutation-response';

export interface IClasificadorCuentas {
  TipoClasificador: number;
  Cuenta: string;
  SubCuenta: string;
  Nombre: string;
  Naturaleza: string;
  Tipo_Analisis_1?: string;
  Tipo_Analisis_2?: string;
  Tipo_Analisis_3?: string;
  Tipo_Analisis_4?: string;
  Tipo_Analisis_5?: string;
  Obligacion: boolean;
  Tipo_Moneda?: string;
  Grupo?: string;
  Clase?: string;
  Categoria?: string;
  Clasificacion?: string;
  Tipo?: string;
  Estado?: string;
  Tipo_Analisis_1_Cons?: string;
  Tipo_Analisis_2_Cons?: string;
  Tipo_Analisis_3_Cons?: string;
  Tipo_Analisis_4_Cons?: string;
  Tipo_Analisis_5_Cons?: string;
  SeUtiliza?: string;
}

export interface ICuentasAgrupadas {
  Cuenta: string;
}

export interface IGrupoCuenta {
  IdGrupo: string;
  Grupo: string;
}

export interface IClaseCuenta {
  ID: number;
  IdClase: string;
  IdGrupo: string;
  Clase: string;
}

export interface ICategoriaCuenta {
  IdCategoria: string;
  IdClase: number;
  Categoria: string;
}

export interface ClasificadorCuentasQueryResponse {
  getAllClasificadorCuentas: IClasificadorCuentas[];
  getClasificadorCuenta: IClasificadorCuentas;
  getCuentasAgrupadas: ICuentasAgrupadas[];
  getAllGrupoCuenta: IGrupoCuenta[];
  getClaseCuentaByIdGrupo: IClaseCuenta[];
  getCategoriaCuentaByIdClase: ICategoriaCuenta[];
}

export interface ClasificadorCuentasMutationResponse {
  saveClasificadorCuenta: IMutationResponse;
  deleteClasificadorCuenta: IMutationResponse;
  arreglaClasificadorCuenta: boolean;
}

export enum ETiposClasificadorCuenta {
  'Consolidado' = 1,
  'Centro' = 2,
  'Complejo' = 3,
}

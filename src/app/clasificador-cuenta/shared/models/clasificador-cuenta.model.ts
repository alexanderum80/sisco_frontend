import { IMutationResponse } from './../../../shared/models/mutation-response';
import { IQueryResponse } from './../../../shared/models/query-response';

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
  getAllClasificadorCuentas: IQueryResponse;
  getClasificadorCuenta: IQueryResponse;
  getCuentasAgrupadas: IQueryResponse;
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

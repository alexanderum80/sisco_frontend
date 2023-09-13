export interface IParteAtrasos {
  IdUnidad: number;
  Unidad: string;
  IdDivision: number;
  Division: string;
  AtrasoRest: number;
  AtrasoDWH: number;
  AtrasoDist: number;
  AtrasoEmp: number;
}

export interface IDatosIdGAM {
  IdUnidad: number;
  Unidad: string;
  Ano: number;
  Mes: number;
  Fecha: string;
  Version: string;
  UltimaCircular: string;
  PeriodoRestaurado: string;
  vUtilnet: string;
}

export interface ParteAtrasosQueryResponse {
  parteAtrasos: IParteAtrasos[];
  datosIdGAM: IDatosIdGAM[];
}

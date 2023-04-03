export interface IConciliaContaInterna {
  Division: string;
  Annio: string;
  Periodo: string;
  CuentaE: string;
  SubCuentaE: string;
  TipoE: string;
  EmisorE: string;
  ReceptorE: string;
  ValorE: number;
  Operador: string;
  CuentaR: string;
  SubCuentaR: string;
  TipoR: string;
  EmisorR: string;
  ReceptorR: string;
  ValorR: number;
  Diferencia: number;
}

export interface IConciliaContaInternaQueryResponse {
  conciliaInternaConta: IConciliaContaInterna[];
}

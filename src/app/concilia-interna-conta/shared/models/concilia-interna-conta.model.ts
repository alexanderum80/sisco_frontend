export interface IConciliaContaInterna {
  Division: string;
  Annio: string;
  Periodo: string;
  Tipo: string;
  Emisor: string;
  Receptor: string;
  CuentaE: string;
  SubCuentaE: string;
  ValorE: number;
  Operador: string;
  CuentaR: string;
  SubCuentaR: string;
  ValorR: number;
  Diferencia: number;
}

export interface IConciliaContaInternaQueryResponse {
  conciliaInternaConta: IConciliaContaInterna[];
}

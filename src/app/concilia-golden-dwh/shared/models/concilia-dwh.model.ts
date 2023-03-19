export interface IConciliaDWH {
  Tipo: string;
  IdCentro: number;
  Centro: string;
  IdUnidad: string;
  Unidad: string;
  IdPiso: string;
  Almacen?: string;
  Cuenta?: string;
  Periodo: string;
  SaldoGolden: number;
  SaldoRestaurador: number;
  DifGoldenRest: number;
  SaldoDistribuidor: number;
  DifGoldenDist: number;
  SaldoRodas: number;
  DifGoldenRodas: number;
  IdDivision: number;
  Division: string;
  CuentaR?: string;
  Nota?: string;
}

export interface ConciliaDWHQueryResponse {
  conciliaDWH: IConciliaDWH[];
}

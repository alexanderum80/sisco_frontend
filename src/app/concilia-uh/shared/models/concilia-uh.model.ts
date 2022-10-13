export interface ConciliaUH {
    Tipo: string;
    IdDivision: number;
    Division: string;
    SubDivision: string;
    Centro: string;
    IdCentro: number;
    IdUnidad: number;
    Unidad: string;
    Periodo: number;
    Cuenta: string;
    SubCuenta: string;
    Analisis1: string;
    Analisis2: string;
    Analisis3: string;
    SaldoUH: number;
    SaldoRodas: number;
    Diferencia: number;
}

export interface ConciliaUHQueryResponse {
    conciliaUH: ConciliaUH[];
}

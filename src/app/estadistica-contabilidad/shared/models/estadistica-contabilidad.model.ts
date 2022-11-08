export interface IEstadisticaContabilidad {
  IdDivision: number;
  Division: string;
  IdCentro: number;
  Centro: string;
  Consolidado: boolean;
  Annio: number;
  Periodo: number;
  FechaInicio: Date;
  FechaFin: Date;
  Comprobantes: number;
  Traspasados: number;
  SinTraspasar: number;
  Invalidos: number;
}

export interface IEstadisticaContabilidadReponse {
  contaEstadistica: IEstadisticaContabilidad[];
}

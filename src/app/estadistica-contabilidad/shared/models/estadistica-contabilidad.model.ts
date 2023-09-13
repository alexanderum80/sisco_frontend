export interface IEstadisticaContabilidad {
  IdDivision: number;
  Division: string;
  IdCentro: number;
  Centro: string;
  Consolidado: boolean;
  Annio: number;
  Periodo: number;
  FechaActualizacion: Date;
  FechaInicio: Date;
  FechaFin: Date;
  Comprobantes: number;
  Traspasados: number;
  SinTraspasar: number;
  Inconclusos: number;
  Anulados: number;
}

export interface IEstadisticaContabilidadReponse {
  contaEstadistica: IEstadisticaContabilidad[];
}

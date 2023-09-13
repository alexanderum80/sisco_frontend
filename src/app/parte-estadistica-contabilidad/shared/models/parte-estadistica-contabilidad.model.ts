export interface IParteEstadisticaContabilidad {
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
  Conexion: string;
}

export interface IParteEstadisticaContabilidadReponse {
  contaEstadisticaParte: IParteEstadisticaContabilidad[];
}

export interface IConciliaAFT {
  Tipo: string;
  Division: string;
  SubDivision: string;
  Centro: string;
  IdCentro: number;
  IdUnidad: number;
  Unidad: string;
  Periodo: number;
  Cta: string;
  SCta: string;
  An1: string;
  An2: string;
  An3: string;
  Saldo_AF: number;
  Saldo_Rodas: number;
  Diferencia: number;
}

export interface IDiferenciaClasificadorCNMB {
  Unidad: string;
  Grupo: string;
  Codigo: string;
  Descripcion: string;
  Deprecia: boolean;
  Tasa: number;
  TasaUC: number;
}

interface IConciliaAftData {
  ConciliaAFT?: IConciliaAFT[];
  DiferenciaClasificadorCNMB?: IDiferenciaClasificadorCNMB[];
}

export interface ConciliaAFTQueryResponse {
  conciliaAFT: IConciliaAftData;
}

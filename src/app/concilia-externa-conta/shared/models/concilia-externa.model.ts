import { IMutationResponse } from './../../../shared/models/mutation-response';
import { IQueryResponse } from './../../../shared/models/query-response';

export interface IConciliaExternaDatosConcilicion {
  IdConciliacion: number;
  Annio: number;
  Mes: number;
  Abierta: boolean;
}

export interface IConciliaExtContab {
  Id: number;
  Annio: number;
  Mes: number;
  Tipo: string;
  CuentaEmisor?: string;
  SubCuentaEmisor?: string;
  DivisionEmisor: number;
  Emisor: number;
  CuentaReceptor?: string;
  SubCuentaReceptor?: string;
  DivisionReceptor: number;
  Receptor: number;
  Documento: number;
  FechaEmision?: string;
  ValorEmisor: number;
  FechaRecepcion?: string;
  ValorReceptor: number;
  DiferenciaDias: number;
  DiferenciaImporte: number;
  Recibido: boolean;
}

export interface IConciliaExtContabResumen {
  Annio: number;
  Mes: number;
  DivisionEmisor: string;
  ValorEmisor: number;
  DivisionReceptor: string;
  ValorReceptor: number;
  Diferencia: number;
}

export interface IConciliaExtContabDeudasPorEdades {
  TipoOperacion: string;
  Annio: number;
  Mes: number;
  IdDivision: number;
  Division: string;
  Valor: number;
  De0a30: number;
  De30a60: number;
  De60a90: number;
  De90a365: number;
  MasDe1Anno: number;
}

export interface IActaConciliacion {
  ID: number;
  Detalle: string;
  Emisor: number;
  Receptor: number;
  SaldoEmisor: number;
  SaldoReceptor: number;
  Diferencia: number;
}

export interface IConciliaEntreUnidades {
  ID: number;
  Annio: number;
  Mes: number;
  IdUnidad: number;
  IdUnidadOD: number;
  IdUsuarioEmisor: number;
  IdUsuarioReceptor: number;
  IdUsuarioSupervisor: number;
  Nota: string;
}

export interface IConciliaExternaContabilidad {
  getConciliaContab: IConciliaExtContab[];
  getActaConciliacion: IActaConciliacion[];
}

export interface IConciliaExternaContabQueryReponse {
  getDatosConciliacionExterna: IConciliaExternaDatosConcilicion;
  getConciliacionExternaContab: IConciliaExternaContabilidad;
  getConciliacionExternaContabResumen: IConciliaExtContabResumen[];
  getConciliacionExternaContabDeudasPorEdades: IConciliaExtContabDeudasPorEdades[];
  getConciliacionEntreUnidades: IConciliaEntreUnidades;
  getDiferenciasEnConciliacion: IQueryResponse;
  getCentrosNoConciliados: IQueryResponse;
}

export interface ConciliaExternaContabMutationReponse {
  updateConciliaContab: IMutationResponse;
  createConciliacionEntreUnidades: IMutationResponse;
  updateConciliacionEntreUnidades: IMutationResponse;
  inicializarConciliacion: IMutationResponse;
  cerrarConciliacion: IMutationResponse;
  reabrirConciliacion: IMutationResponse;
}

export enum ConciliaMenuOptions {
  'IniciarConciliacion' = 'iniciarConcilia',
  'CerrarConciliacion' = 'cerrarConcilia',
  'ReabrirConciliacion' = 'reabrirConcilia',
  'DiferenciasConciliacion' = 'diferenciasConciliacion',
  'CentroNoConciliados' = 'centroNoConciliados',
  'DeudasResumen' = 'deudasResumen',
}

export enum ConciliaStatus {
  'NoIniciada' = 'NO INICIADA',
  'Abierta' = 'ABIERTA',
  'Cerrada' = 'CERRADA',
}

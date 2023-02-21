import { IMutationResponse } from './../../../shared/models/mutation-response';
import { IQueryResponse } from './../../../shared/models/query-response';

export interface IConciliaExternaDatosConcilicion {
  IdConciliacion: number;
  Annio: number;
  Mes: number;
  Abierta: boolean;
}

export interface IConciliaContab {
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

export interface IActaConciliacion {
  ID: number;
  Detalle: string;
  Emisor: number;
  Receptor: number;
  SaldoEmisor: number;
  SaldoReceptor: number;
  Diferencia: number;
}

export interface IConciliaExternaContabilidad {
  getConciliaContab: IConciliaContab[];
  getActaConciliacion: IActaConciliacion[];
}

export interface IConciliaExternaContabQueryReponse {
  getRecepcionesDifCantidad: IQueryResponse;
  getDatosConciliacionExterna: IConciliaExternaDatosConcilicion;
  getConciliacionExternaContab: IConciliaExternaContabilidad;
  // getActaConciliacion: IActaConciliacion[];
  getConciliacionEntreUnidades: IQueryResponse;
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
}

export class IConciliaReporteClasificador {
  cuenta: string;
  subcuenta: string;
  descripcion: string;
  crt1_clasif?: string;
  crt2_clasif?: string;
  crt3_clasif?: string;
  crt4_clasif?: string;
  crt5_clasif?: string;
  nat_clasif?: string;
  obl_clasif?: boolean;
  grupo_clasif?: string;
  clase_clasif?: string;
  categ_clasif?: string;
  clasif_clasif?: string;
  tipo_clasif?: string;
  estado_clasif?: string;
  crt1_rodas?: string;
  crt2_rodas?: string;
  crt3_rodas?: string;
  crt4_rodas?: string;
  crt5_rodas?: string;
  nat_rodas?: string;
  obl_rodas?: boolean;
  grupo_rodas?: string;
  clase_rodas?: string;
  categ_rodas?: string;
  clasif_rodas?: string;
  tipo_rodas?: string;
  estado_rodas?: string;
}

export class IConciliaReporteConsulta {
  Periodo: number;
  Centro: string;
  Id_Consulta: string;
  Consulta: string;
  Cuenta?: string;
  SubCuenta?: string;
  Analisis1?: string;
  Analisis2?: string;
  Analisis3?: string;
  Analisis4?: string;
  Analisis5?: string;
  Total: number;
  Consolidado: boolean;
}

export class IConciliaReporteExpresiones {
  Centro: number;
  Consolidado: boolean;
  Periodo: number;
  Expresion: string;
  Valor: number;
  Operador: string;
  ExpresionC: string;
  ValorC: number;
  Resultado: string;
}

export class IConciliaReporteValores {
  Centro: string;
  Periodo: number;
  Consolidado: boolean;
  Expresion: string;
  Valor: number;
  Operador: string;
  Valor_Rodas: number;
  Estado: string;
  Division: string;
}

export class IConciliaCuadreSistemas {
  Centro: number;
  Sistema: string;
  Estado: string;
}

export class IConciliaInformacionContabilidad {
  Criterio: string;
  Saldo: number;
}

export class IConciliaContabilidad {
  ReporteClasificador: IConciliaReporteClasificador[];
  ReporteConsultas: IConciliaReporteConsulta[];
  ReporteExpresiones: IConciliaReporteExpresiones[];
  ReporteValores: IConciliaReporteValores[];
  CuadreSistemas: IConciliaCuadreSistemas[];
  Informacion: IConciliaInformacionContabilidad[];
}

export class IChequeoCentroVsConsolidado {
  Centro: string;
  Unidad: string;
  Consolidado: boolean;
  Periodo: number;
  IdConsulta: string;
  Consulta: string;
  Cuenta?: string;
  SubCuenta?: string;
  Analisis1?: string;
  Analisis2?: string;
  Analisis3?: string;
  Analisis4?: string;
  Analisis5?: string;
  Total: number;
}

export interface ConciliaContabilidadQueryResponse {
  conciliaContabilidad: IConciliaContabilidad;
  chequearCentros: IChequeoCentroVsConsolidado[];
}

export interface ConciliaContabilidadMutationReponse {
  iniciarSaldos: boolean;
}

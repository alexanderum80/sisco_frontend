export interface IInformeCtasCobrarPagar {
  Division: string;
  Organismo: string;
  Grupo: string;
  Cuenta: string;
  ProveedorCliente: string;
  Saldo: number;
  Hasta30: number;
  De30a60: number;
  De60a90: number;
  MasDe90: number;
}

export interface InformeCtasCobrarPagarQueryReponse {
  contaInformeCtasCobrarPagar: IInformeCtasCobrarPagar[];
}

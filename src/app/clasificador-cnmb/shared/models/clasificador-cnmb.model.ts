export interface IActFijosClasificadorCnmb {
  CNMB: number;
  DCNMB: string;
  TREPO: number;
}

export interface ClasificadorCNMBQueryResponse {
  getAllActFijosClasificadorCnmb: [IActFijosClasificadorCnmb];
  getActFijosClasificadorCnmb: IActFijosClasificadorCnmb;
}

export interface ClasificadorCNMBMutationResponse {
  saveActFijosClasificadorCnmb: IActFijosClasificadorCnmb;
  deleteActFijosClasificadorCnmb: number;
}

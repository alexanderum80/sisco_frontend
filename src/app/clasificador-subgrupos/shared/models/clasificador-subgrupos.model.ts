export interface IActFijosClasificadorSubgrupos {
  Grupo: number;
  Codigo: number;
  Descripcion: string;
  Tasa: number;
}

export interface ClasificadorSubgruposQueryResponse {
  getAllActFijosClasificadorSubgrupo: [IActFijosClasificadorSubgrupos];
  getActFijosClasificadorSubgrupo: IActFijosClasificadorSubgrupos;
}

export interface ClasificadorSubgruposMutationResponse {
  saveActFijosClasificadorSubgrupo: IActFijosClasificadorSubgrupos;
  deleteActFijosClasificadorSubgrupo: number;
}

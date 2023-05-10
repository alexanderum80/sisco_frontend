export interface ISubdivisiones {
  IdSubdivision: number;
  Subdivision: string;
  IdDivision: number;
}

export interface SubdivisionesQueryResponse {
  getAllSubdivisiones: ISubdivisiones[];
  getSubdivisionesByIdDivision: ISubdivisiones[];
}

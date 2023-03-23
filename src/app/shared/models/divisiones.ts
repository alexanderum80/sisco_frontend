export interface IDivisiones {
  IdDivision: number;
  Division: string;
}

export interface DivisionesQueryResponse {
  getAllDivisiones: IDivisiones[];
  getAllDivisionesByUsuario: IDivisiones[];
  getDivisionById: IDivisiones;
}

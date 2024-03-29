import { IMutationResponse } from './../../../shared/models/mutation-response';

export interface IEmpleadoInfo {
  IdEmpleado: number;
  Empleado: string;
  Cargo: any;
  Division: any;
}

export interface IEmpleado {
  IdEmpleado: number;
  Empleado: string;
  IdCargo: number;
  IdDivision: number;
}

interface IEmpleadoQueryResponse {
  success: boolean;
  data: IEmpleadoInfo;
  error: string;
}

interface IEmpleadosQueryResponse {
  success: boolean;
  data: IEmpleadoInfo[];
  error: string;
}

export interface EmpleadosQueryResponse {
  getAllEmpleados: IEmpleadosQueryResponse;
  getEmpleadosByIdDivision: IEmpleadosQueryResponse;
  getEmpleadoById: IEmpleadoQueryResponse;
}

export interface EmpleadosMutationResponse {
  createEmpleado: IMutationResponse;
  updateEmpleado: IMutationResponse;
  deleteEmpleado: IMutationResponse;
}

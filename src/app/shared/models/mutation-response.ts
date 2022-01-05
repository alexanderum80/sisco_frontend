export interface IMutationResponse {
    success: boolean;
    data?: string;
    error?: string;
}

export type MutationActions = 'Agregar' | 'Modificar' | 'Eliminar';

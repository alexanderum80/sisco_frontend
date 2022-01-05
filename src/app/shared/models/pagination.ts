
export interface IPaginationDetails {
    pageIndex: number;
    pageSizeOptions: number[];
    firstPageLabel: string;
    itemsPerPageLabel: string;
    lastPageLabel: string;
    nextPageLabel: string;
    previousPageLabel: string;
    sortBy?: string;
    filter?: string;
}

export const PaginationDetailsDefault: IPaginationDetails = {
    pageIndex: 0,
    pageSizeOptions: [20, 50, 100],
    itemsPerPageLabel: 'Registros por página',
    firstPageLabel: 'Primera página',
    lastPageLabel: 'Última página',
    nextPageLabel: 'Página siguiente',
    previousPageLabel: 'Página anterior'
};

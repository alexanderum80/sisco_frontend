export interface ITableColumns {
    field: string;
    header: string;
    type: 'string' | 'date' | 'number' | 'decimal' | 'boolean' | 'image';
    totalize?: boolean;
    width?: string;
    ngClass?: any;
    ngStyle?: any;
}

import { Injectable } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { Subject } from 'rxjs';
import { PaginationDetailsDefault } from 'src/app/shared/models';

@Injectable()
export class CustomPaginator implements MatPaginatorIntl {
    changes = new Subject<void>();

    itemsPerPageLabel = PaginationDetailsDefault.itemsPerPageLabel;
    firstPageLabel = PaginationDetailsDefault.firstPageLabel;
    lastPageLabel = PaginationDetailsDefault.lastPageLabel;
    nextPageLabel = PaginationDetailsDefault.nextPageLabel;
    previousPageLabel = PaginationDetailsDefault.previousPageLabel;

    getRangeLabel(page: number, pageSize: number, length: number): string {
        if (length === 0) {
            return `Página 1 de 1`;
        }
        const amountPages = Math.ceil(length / pageSize);
        return `Página ${page + 1} de ${amountPages}`;
    }
}

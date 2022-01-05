import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { CustomPaginator } from '../models/custom-paginator-config';


@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    { provide: MatPaginatorIntl, useClass: CustomPaginator }
  ],
  exports: [MatPaginatorModule]
})
export class PaginatorModule { }

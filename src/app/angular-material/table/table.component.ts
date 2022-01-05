import { PaginationDetailsDefault } from './../../shared/models/pagination';
import { IMenuItem } from './../../shared/models/menu-item';
import { MaterialTableColumns } from './../models/mat-table.model';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Component, Input, OnChanges, OnInit, Output, ViewChild, EventEmitter, ElementRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'am-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit, OnChanges {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  // @ViewChild('inputFilter') inputFilter: ElementRef;
  inputFilter = '';

  @Input() columns: MaterialTableColumns[] = [];
  @Input() data: any[] = [];
  @Input() menuItems: IMenuItem[];
  @Input() filter = true;

  @Output() clickAction = new EventEmitter();

  paginationDetailsDefault = PaginationDetailsDefault;

  displayedColumns: string[];
  dataSource = new MatTableDataSource();

  loading = true;

  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(): void {
    this.displayedColumns = this.columns.map(c => {
      return c.field;
    });

    if (this.menuItems) {
      this.displayedColumns.push('MENU');
    }

    if (this.data) {
      this.loading = false;
      this.dataSource = new MatTableDataSource(this.data);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    }

    this.applyFilter();
  }

  getDisplayedColumns(): any[] {
    return this.displayedColumns.filter(f => f !== 'MENU') || [];
  }

  getFieldName(field: string): string {
    return this.columns.find(f => f.field === field)?.name || '';
  }

  getData(row: any[], column: number): any {
    return row[column];
  }

  onClicked(action: any, element: any): void {
    const outPutValues = {
      action,
      element
    };

    this.clickAction.emit(outPutValues);
  }

  applyFilter(): void {
    const filterValue = this.inputFilter || '';
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  clearFilter(): void {
    this.inputFilter = '';
    this.applyFilter();
  }

}

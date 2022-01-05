import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { ITableColumns } from './table.model';
import {get} from 'lodash';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'png-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {
  @Input() columns: ITableColumns[] = [];
  @Input() data: any[] = [];
  @Input() filterData = true;
  @Input() paginator = true;
  @Input() loading = false;
  @Input() menuItems: MenuItem[];
  @Input() groupField: string;

  _ = get;

  constructor() { }

  ngOnInit(): void {
  }

  getFields(): string[] {
    return this.columns.map(c => c.field);
  }

  updateMetaData(data: any): void {
    this.menuItems.map(m => m.automationId = data);
  }

}

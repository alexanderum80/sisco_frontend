import { ActionClicked } from './../../../models/list-items';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { ITableColumns } from './table.model';
import { get, upperCase } from 'lodash';
import { IButtons } from '../button/button.model';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'png-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnChanges {
  @Input() caption: string;
  @Input() columns: ITableColumns[] = [];
  @Input() data: any[] = [];
  @Input() filterData = true;
  @Input() paginator = true;
  @Input() loading = false;
  @Input() selectCheckbox = false;
  @Input() selectRowOnClick = false;
  @Input() groupField: string;
  @Input() groupMode: 'subheader' | 'rowspan' = 'subheader';
  @Input() expandableGroup = false;
  @Input() totalizeGroup = false;
  @Input() totalizeTable = false;
  @Input() resizableColumns = false;
  @Input() operations = false;
  @Input() topLeftButtons: IButtons[] = [];
  @Input() topRightButtons: IButtons[] = [];
  @Input() inlineButtons: IButtons[] = [];
  @Input() scrollable = false;
  @Input() scrollHeight = '';
  @Input() responsiveLayout: 'scroll' | 'stack' = 'scroll';

  @Output() actionClicked = new EventEmitter<any>();
  @Output() selectedRows = new EventEmitter<any>();
  @Output() selectedRowIndex = new EventEmitter<number>();
  @Output() filteredData = new EventEmitter<any[]>();

  viewportHeight = 120;
  get = get;

  selectedRowsData: any[] = [];
  selectedRowDataIndex?: number;

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    this.selectedRowsData = [];
    this.selectedRowDataIndex = undefined;

    this.switchRowSelection();
  }

  getFields(): string[] {
    return this.columns.map(c => c.field);
  }

  getTotalsGroup(data: any[], column: ITableColumns) {
    let value = '';
    const index = this.columns.findIndex(c => c.field === column.field);
    if (index === 0) {
      value = `TOTAL ${upperCase(this.groupField)}`;
    } else if (column.totalize) {
      const fieldValue = this.get(data, this.groupField);
      value = this.data
        .filter(f => f[this.groupField] === fieldValue)
        .map(m => m[column.field])
        .reduce((acc, amount) => acc + amount, 0);
    }

    return value;
  }

  getTotalsFooter(column: ITableColumns) {
    let value = '';
    const index = this.columns.findIndex(c => c.field === column.field);
    if (index === 0) {
      value = 'TOTAL';
    } else if (column.totalize) {
      value = this.data
        .map(m => m[column.field])
        .reduce((acc, amount) => acc + amount, 0);
    }

    return value;
  }

  onActionClicked(button: IButtons, data?: any) {
    switch (button.id) {
      case ActionClicked.Delete:
        this.actionClicked.emit({
          action: 'delete',
          item: data || this.selectedRowsData,
        });
        break;
      default:
        this.actionClicked.emit({
          action: button.id,
          item: data || [],
        });
        break;
    }
  }

  switchRowSelection() {
    this.selectedRows.emit(this.selectedRowsData);
  }

  onClickRow(data: any, rowIndex: number): void {
    if (this.selectRowOnClick) {
      this.selectedRowDataIndex = rowIndex;
      this.selectedRowIndex.emit(this.selectedRowDataIndex);

      this.actionClicked.emit({
        action: 'selectedRow',
        item: data,
      });
    }
  }

  onFilterData(event: any): void {
    this.filteredData.emit(event.filteredValue);
  }
}

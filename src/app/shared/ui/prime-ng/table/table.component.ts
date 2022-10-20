import { ActionClicked } from './../../../models/list-items';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ITableColumns } from './table.model';
import { get, upperCase } from 'lodash';
import { IButtons } from '../button/button.model';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'png-table',
    templateUrl: './table.component.html',
    styleUrls: ['./table.component.scss'],
})
export class TableComponent {
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
    @Input() responsiveLayout: 'scroll' | 'stack' = 'scroll'

    @Output() actionClicked = new EventEmitter<any>();
    @Output() selectedRows = new EventEmitter<any>();
    @Output() selectedRowIndex = new EventEmitter<number>();

    viewportHeight = 120;
    dateFormat = 'dd/MM/yyyy';
    get = get;

    selectedRowsData: any[] = [];
    selectedRowDataIndex: number;

    constructor() {}

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
}

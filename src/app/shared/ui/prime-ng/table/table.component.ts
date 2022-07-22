import { ActionClicked } from './../../../models/list-items';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ITableColumns } from './table.model';
import { get, upperCase } from 'lodash';
import { TableService } from './table.service';
import { IButtons } from '../button/button.model';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'png-table',
    templateUrl: './table.component.html',
    styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnInit {
    @Input() caption: string;
    @Input() columns: ITableColumns[] = [];
    @Input() data: any[] = [];
    @Input() filterData = true;
    @Input() paginator = true;
    @Input() loading = false;
    @Input() canSelect = false;
    @Input() groupField: string;
    @Input() groupMode: 'subheader' | 'rowspan' = 'subheader';
    @Input() totalizeGroup = false;
    @Input() totalizeTable = false;
    @Input() expandible = false;
    @Input() resizableColumns = false;
    @Input() operations = false;
    @Input() topLeftButtons: IButtons[] = [];
    @Input() topRightButtons: IButtons[] = [];
    @Input() inlineButtons: IButtons[] = [];
    @Input() scrollable = false;
    @Input() scrollHeight = '';

    @Output() actionClicked = new EventEmitter<any>();

    viewportHeight = 120;
    get = get;

    constructor(private _tableSvc: TableService) {}

    ngOnInit(): void {
        this.selectedRow = this._tableSvc.selectedRow;
    }

    getFields(): string[] {
        return this.columns.map(c => c.field);
    }

    get selectedRow(): any[] {
        return this._tableSvc.selectedRow;
    }

    set selectedRow(selected: any) {
        this._tableSvc.selectedRow = selected;
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
                    item: data || this._tableSvc.selectedRow,
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
}

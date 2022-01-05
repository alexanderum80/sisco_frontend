import { ISelectableOptions } from './../models/selectable-item';
import { Injectable } from '@angular/core';

@Injectable()
export class AgGridService {
  gridApi;

  defaultColDef = {
    floatingFilter: true,
    sortable: true,
    resizable: true,
  };
  columnDefs = [];
  rowData: any[];

  overlayLoadingTemplate =
    '<span class="ag-overlay-loading-center">Cargando datos. Espere un momento...</span>';
  overlayNoRowsTemplate =
    '<span class="ag-overlay-loading-center">No hay datos para mostrar.</span>';

  constructor() { }

  static cellValueComparator(filterType: string, value: any, filterText: string, sourceList: ISelectableOptions[]): boolean {
    const filterTextLowerCase = filterText.toLowerCase();
    const valueLowerCase = value.toString().toLowerCase();
    let filterValue;

    switch (filterType) {
        case 'contains':
          filterValue = sourceList.find(t => t.value.toString() === valueLowerCase);
          return filterValue.description.toLowerCase().indexOf(filterTextLowerCase) >= 0;
        case 'notContains':
          filterValue = sourceList.find(t => t.value.toString() === valueLowerCase);
          return filterValue.description.toLowerCase().indexOf(filterTextLowerCase) === -1;
        case 'equals':
          filterValue = sourceList.find(t => t.value.toString() === valueLowerCase);
          return filterValue.description.toLowerCase() === filterTextLowerCase;
        case 'notEqual':
          filterValue = sourceList.find(t => t.value.toString() === valueLowerCase);
          return filterValue.description.toLowerCase() !== filterTextLowerCase;
        case 'startsWith':
          filterValue = sourceList.find(t => t.value.toString() === valueLowerCase);
          return filterValue.description.toLowerCase().indexOf(filterTextLowerCase) === 0;
        case 'endsWith':
          filterValue = sourceList.find(t => t.value.toString() === valueLowerCase);
          const index = filterValue.description.toLowerCase().lastIndexOf(filterTextLowerCase);
          return index >= 0 && index === (filterValue.description.length - filterTextLowerCase.length);
    }
  }

  private _getNewRow(): any {
    const res = {};

    for (const [key, value] of Object.entries(this.columnDefs)) {
      res[value.field] = '';
    }

    return res;
  }

  getSelectedRows(): any {
    return this.gridApi.getSelectedRows();
  }

  addNewRow(): void {
    this.gridApi.setFilterModel();

    const newRow = this._getNewRow();

    this.gridApi.applyTransaction({ add: [newRow] });

    const gridModel = this.gridApi.getModel();
    const selectedNode = gridModel.nodeManager.nextId - 1;

    if (selectedNode >= 0) {
        this.gridApi.ensureIndexVisible(selectedNode + 1, null);
        const node = this.gridApi.getRowNode(selectedNode);

        if (node) {
            node.setSelected(true);
            this.gridApi.setFocusedCell(selectedNode, this.columnDefs[1].field);

            this.gridApi.startEditingCell(
            {
              rowIndex: selectedNode,
              colKey: this.columnDefs[1].field
            });
        }
    }
  }

  removeSelectedRows(): any {
    try {
      const selectedRows = this.getSelectedRows();

      this.gridApi.applyTransaction({ remove: selectedRows });
    } catch (err) {
      return { success: false, error: err };
    }
  }


}

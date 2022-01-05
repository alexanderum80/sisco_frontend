import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class MaterialService {
  private _dataSource = [];
  private _displayedColumns = [];

  constructor(
    private _snackBar: MatSnackBar
  ) { }

  openSnackBar(message: string, close = 'Aceptar', duration = 2500): void {
    this._snackBar.open(message, close, { duration });
  }

  set dataSource(data) {
    this._dataSource = data;
  }

  get dataSource(): any {
    return this._dataSource;
  }

  set displayedColumns(columns) {
    this._displayedColumns = columns;
  }

  get displayedColumns(): any {
    return this._displayedColumns;
  }

}

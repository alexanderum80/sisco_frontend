import { Injectable } from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';

@Injectable({
  providedIn: 'root',
})
export class DinamicDialogService {
  ref: DynamicDialogRef;

  constructor(private _dialogSvc: DialogService) {}

  open(header: string, component: any, width?: string): void {
    this.ref = this._dialogSvc.open(component, {
      header: header,
      closable: false,
      width: width,
      baseZIndex: 1000,
    });
  }

  close(message?: string): void {
    this.ref.close(message || null);
  }
}

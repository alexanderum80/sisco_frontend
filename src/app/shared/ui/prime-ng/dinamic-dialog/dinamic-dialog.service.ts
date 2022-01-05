import { Injectable } from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';

@Injectable({
  providedIn: 'root'
})
export class DinamicDialogService {

  ref: DynamicDialogRef | undefined;

  constructor(
    private _dialogSvc: DialogService
  ) { }

  public open(component: any, header: string): void {
    this.ref = this._dialogSvc.open(component, {
      header,
      contentStyle: {'max-height': '80%', overflow: 'auto'},
      baseZIndex: 10000
    });

    this.ref.onClose.subscribe(() => {
      this.ref = undefined;
    });
  }

  public close(): void {
    if (this.ref) {
      this.ref.close();
    }
  }

}

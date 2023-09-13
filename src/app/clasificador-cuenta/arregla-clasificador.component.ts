import { ClasificadorCuentaService } from './shared/service/clasificador-cuenta.service';
import { SweetalertService } from '../shared/helpers/sweetalert.service';
import { NavigationService } from '../navigation/shared/services/navigation.service';
import { DinamicDialogService } from '../shared/ui/prime-ng/dinamic-dialog/dinamic-dialog.service';
import { Component, OnInit } from '@angular/core';
import { ArreglaClasificadorFormComponent } from './arregla-clasificador-form/arregla-clasificador-form.component';

@Component({
  selector: 'app-arregla-clasificador',
  template: '<div></div>',
})
export class ArreglaClasificadorComponent implements OnInit {
  constructor(
    private _dinamicDialogSvc: DinamicDialogService,
    private _navigationSvc: NavigationService,
    private _swalSvc: SweetalertService,
    private _clasificadorCuentaSvc: ClasificadorCuentaService
  ) {}

  ngOnInit(): void {
    try {
      this._dinamicDialogSvc.open(
        'Arreglar Clasificador Contable del Rodas',
        ArreglaClasificadorFormComponent,
        '500px'
      );
      this._clasificadorCuentaSvc.subscription.push(
        this._dinamicDialogSvc.ref.onClose.subscribe(() =>
          this._navigationSvc.navigateTo('')
        )
      );
    } catch (err: any) {
      this._swalSvc.error(err.message || err);
    }
  }
}

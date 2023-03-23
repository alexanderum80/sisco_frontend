import { InformeCuentasCobrarPagarService } from './shared/services/informe-cuentas-cobrar-pagar.service';
import { InformeCuentasCobrarPagarFormComponent } from './informe-cuentas-cobrar-pagar-form/informe-cuentas-cobrar-pagar-form/informe-cuentas-cobrar-pagar-form.component';
import { SweetalertService } from './../shared/helpers/sweetalert.service';
import { NavigationService } from './../navigation/shared/services/navigation.service';
import { DinamicDialogService } from 'src/app/shared/ui/prime-ng/dinamic-dialog/dinamic-dialog.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-informe-cuentas-cobrar-pagar',
  template: '<div></div>',
})
export class InformeCuentasCobrarPagarComponent implements OnInit {
  constructor(
    private _dinamicDialogSvc: DinamicDialogService,
    private _navigationSvc: NavigationService,
    private _swalSvc: SweetalertService,
    private _informeCtaCobrarPagarSvc: InformeCuentasCobrarPagarService
  ) {}

  ngOnInit(): void {
    try {
      this._dinamicDialogSvc.open(
        'Informe de Cuentas por Cobrar y Pagar',
        InformeCuentasCobrarPagarFormComponent,
        '500px'
      );
      this._informeCtaCobrarPagarSvc.subscription.push(
        this._dinamicDialogSvc.ref.onClose.subscribe(() =>
          this._navigationSvc.navigateTo('')
        )
      );
    } catch (err: any) {
      this._swalSvc.error(err.message || err);
    }
  }
}

import { ActionClicked } from './../../shared/models/list-items';
import { UnidadesService } from './../../unidades/shared/services/unidades.service';
import { CuentasNoPermitidasService } from './../shared/services/cuentas-no-permitidas.service';
import { SweetalertService } from './../../shared/services/sweetalert.service';
import { DinamicDialogService } from './../../shared/ui/prime-ng/dinamic-dialog/dinamic-dialog.service';
import { SelectItem } from 'primeng/api';
import { FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cuentas-no-permitidas-form',
  templateUrl: './cuentas-no-permitidas-form.component.html',
  styleUrls: ['./cuentas-no-permitidas-form.component.scss']
})
export class CuentasNoPermitidasFormComponent implements OnInit {
  action: ActionClicked;

  fg: FormGroup;

  centrosValues: SelectItem[] = [];

  constructor(
    private _cuentasNoPermitidasSvc: CuentasNoPermitidasService,
    private _unidadesSvc: UnidadesService,
    private _dinamicDialogSvc: DinamicDialogService,
    private _sweetAlertSvc: SweetalertService
  ) {
    this.fg = _cuentasNoPermitidasSvc.fg;
  }

  ngOnInit(): void {
    this.action = this.fg.controls['id'].value === 0 ? ActionClicked.Add : ActionClicked.Edit;
    this._loadCentros();
  }

  private _loadCentros(): void {
    try {
      this._unidadesSvc.getAllUnidades().subscribe(response => {
        const result = response.getAllUnidades;

        if (!result.success) {
          throw new Error(result.error);
        }

        this.centrosValues = result.data.map((u: { IdUnidad: string; Nombre: string; }) => {
          return {
            value: String(u.IdUnidad),
            label: u.IdUnidad + '-' + u.Nombre
          };
        });
      });
    } catch (err: any) {
      this._sweetAlertSvc.error(`Ocurrió el siguiente error: ${ err }`);
    }
  }

  onActionClicked(event: ActionClicked): void {
    switch (event) {
      case ActionClicked.Save:
        this._save();
        break;
      case ActionClicked.Cancel:
        this._dinamicDialogSvc.close();
        break;
    }
  }

  private _save(): void {
    try {
      this._cuentasNoPermitidasSvc.saveCuentaNoPermitida().subscribe(response => {
        const result = this.action === ActionClicked.Add ? response.createNoUsarEnCuenta : response.updateNoUsarEnCuenta;

        if (!result.success) {
          throw new Error(result.error);
        }

        let txtMessage = `La Cuenta no Permitida se ha ${ this.action === ActionClicked.Add ? 'creado' : 'actualizado' } correctamente.`
        this._dinamicDialogSvc.close(txtMessage);
      });
    } catch (err: any) {
      this._sweetAlertSvc.error(`Ha ocurrido el siguiente error: ${ err }`);
    }
  }

}

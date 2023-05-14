import { ActionClicked } from './../../shared/models/list-items';
import { UnidadesService } from './../../unidades/shared/services/unidades.service';
import { CuentasNoPermitidasService } from './../shared/services/cuentas-no-permitidas.service';
import { SweetalertService } from './../../shared/helpers/sweetalert.service';
import { DinamicDialogService } from './../../shared/ui/prime-ng/dinamic-dialog/dinamic-dialog.service';
import { SelectItem } from 'primeng/api';
import { FormGroup } from '@angular/forms';
import {
  AfterContentChecked,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { IUnidades } from 'src/app/unidades/shared/models/unidades.model';

@Component({
  selector: 'app-cuentas-no-permitidas-form',
  templateUrl: './cuentas-no-permitidas-form.component.html',
  styleUrls: ['./cuentas-no-permitidas-form.component.scss'],
})
export class CuentasNoPermitidasFormComponent
  implements OnInit, AfterContentChecked
{
  action: ActionClicked;

  fg: FormGroup;

  centrosValues: SelectItem[] = [];

  constructor(
    private _cuentasNoPermitidasSvc: CuentasNoPermitidasService,
    private _unidadesSvc: UnidadesService,
    private _dinamicDialogSvc: DinamicDialogService,
    private _swalSvc: SweetalertService,
    private _cd: ChangeDetectorRef
  ) {
    this.fg = _cuentasNoPermitidasSvc.fg;
  }

  ngOnInit(): void {
    this.action =
      this.fg.controls['id'].value === 0
        ? ActionClicked.Add
        : ActionClicked.Edit;
    this._loadCentros();
  }

  ngAfterContentChecked(): void {
    this._cd.detectChanges();
  }

  private _loadCentros(): void {
    try {
      this._unidadesSvc.getAllUnidadesByUsuario().subscribe({
        next: res => {
          const data = res.getAllUnidadesByUsuario;

          this.centrosValues = data.map((u: IUnidades) => {
            return {
              value: String(u.IdUnidad),
              label: u.Nombre,
            };
          });
        },
        error: err => {
          this._swalSvc.error(err);
        },
      });
    } catch (err: any) {
      this._swalSvc.error(err);
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
      this._cuentasNoPermitidasSvc.saveCuentaNoPermitida().subscribe(res => {
        const result =
          this.action === ActionClicked.Add
            ? res.createNoUsarEnCuenta
            : res.updateNoUsarEnCuenta;

        if (!result.success) {
          throw new Error(result.error);
        }

        let txtMessage = `La Cuenta no Permitida se ha ${
          this.action === ActionClicked.Add ? 'creado' : 'actualizado'
        } correctamente.`;
        this._dinamicDialogSvc.close(txtMessage);
      });
    } catch (err: any) {
      this._swalSvc.error(err);
    }
  }
}

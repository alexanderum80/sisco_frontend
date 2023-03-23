import { AuthenticationService } from './../../shared/services/authentication.service';
import { ActionClicked } from './../../shared/models/list-items';
import { CargosService } from './../../shared/services/cargos.service';
import { DivisionesService } from './../../shared/services/divisiones.service';
import { toNumber } from 'lodash';
import { DinamicDialogService } from './../../shared/ui/prime-ng/dinamic-dialog/dinamic-dialog.service';
import { EmpleadosService } from './../shared/services/empleados.service';
import { FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { SweetalertService } from '../../shared/helpers/sweetalert.service';
import { SelectItem } from 'primeng/api';

@Component({
  selector: 'app-empleados-form',
  templateUrl: './empleados-form.component.html',
  styleUrls: ['./empleados-form.component.scss'],
})
export class EmpleadosFormComponent implements OnInit {
  action: ActionClicked;

  fg: FormGroup;

  divisionesValues: SelectItem[] = [];

  cargosValues: SelectItem[] = [];

  constructor(
    private _authSvc: AuthenticationService,
    private _empleadosSvc: EmpleadosService,
    private _cargosSvc: CargosService,
    private _dinamicDialogSvc: DinamicDialogService,
    private _divisionesSvc: DivisionesService,
    private _swalSvc: SweetalertService
  ) {}

  ngOnInit(): void {
    this.fg = this._empleadosSvc.fg;
    this.action =
      toNumber(this.fg.controls['idEmpleado'].value) === 0
        ? ActionClicked.Add
        : ActionClicked.Edit;

    this._getCargos();

    this._getDivisiones();
  }

  private _getCargos(): void {
    try {
      this._empleadosSvc.subscription.push(
        this._cargosSvc.getCargos().subscribe(res => {
          const result = res.getAllCargos;

          if (!result.success) {
            return this._swalSvc.error(result.error);
          }

          this.cargosValues = result.data.map(
            (data: { IdCargo: any; Cargo: any }) => {
              return {
                value: data.IdCargo,
                label: data.Cargo,
              };
            }
          );
        })
      );
    } catch (err: any) {
      this._swalSvc.error(err);
    }
  }

  private _getDivisiones(): void {
    try {
      this._empleadosSvc.subscription.push(
        this._divisionesSvc.getDivisionesByUsuario().subscribe({
          next: res => {
            const result = res.getAllDivisionesByUsuario;

            this.divisionesValues = result.map(d => {
              return {
                value: d.IdDivision,
                label: d.IdDivision + '-' + d.Division,
              };
            });
          },
          error: err => {
            this._swalSvc.error(err);
          },
        })
      );
    } catch (err: any) {
      this._swalSvc.error(err);
    }
  }

  get isSuperAdmin(): boolean {
    return this._authSvc.hasSuperAdminPermission();
  }

  onActionClicked(action: ActionClicked) {
    switch (action) {
      case ActionClicked.Save:
        this._save();
        break;
      case ActionClicked.Cancel:
        this._closeModal();
        break;
    }
  }

  private _save(): void {
    this._empleadosSvc.subscription.push(
      this._empleadosSvc.save().subscribe(res => {
        let result;
        let txtMessage;

        if (this.action === ActionClicked.Add) {
          result = res.createEmpleado;
          txtMessage = 'El Empleado se ha creado correctamente.';
        } else {
          result = res.updateEmpleado;
          txtMessage = 'El Empleado se ha actualizado correctamente.';
        }

        if (!result.success) {
          return this._swalSvc.error(result.error);
        }

        this._closeModal(txtMessage);
      })
    );
  }

  private _closeModal(message?: string): void {
    this._dinamicDialogSvc.close(message);
  }
}

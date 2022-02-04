import { SelectItem } from 'primeng/api';
import { ActionClicked } from './../../shared/models/list-items';
import { CargosService } from './../../shared/services/cargos.service';
import { DivisionesService } from './../../shared/services/divisiones.service';
import SweetAlert from 'sweetalert2';
import { toNumber } from 'lodash';
import { DinamicDialogService } from './../../shared/ui/prime-ng/dinamic-dialog/dinamic-dialog.service';
import { SupervisoresService } from './../shared/services/supervisores.service';
import { UsuarioService } from './../../shared/services/usuario.service';
import { FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-supervisores-form',
  templateUrl: './supervisores-form.component.html',
  styleUrls: ['./supervisores-form.component.scss'],
})
export class SupervisoresFormComponent implements OnInit {
  action: ActionClicked;

  fg: FormGroup;

  divisionesValues: SelectItem[] = [];

  cargosValues: SelectItem[] = [];

  constructor(
    private _usuarioSvc: UsuarioService,
    private _divisionesSvc: DivisionesService,
    private _supervisoresSvc: SupervisoresService,
    private _cargosSvc: CargosService,
    private _dinamicDialogSvc: DinamicDialogService,
  ) { }

  ngOnInit(): void {
    this.fg = this._supervisoresSvc.fg;
    this.action = toNumber(this.fg.controls['idSupervisor'].value) === 0 ? ActionClicked.Add : ActionClicked.Edit;

    this._getCargos();

    this._getDivisiones();
  }

  private _getCargos(): void {
    try {
      this._supervisoresSvc.subscription.push(this._cargosSvc.getCargos().subscribe(response => {
        const result = response.getAllCargos;

        if (!result.success) {
          return SweetAlert.fire({
            icon: 'error',
            title: 'ERROR',
            text: `Se produjo el siguiente error: ${ result.error }`,
            showConfirmButton: true,
            confirmButtonText: 'Aceptar'
          });
        }

        this.cargosValues = result.data.map((data: { IdCargo: any; Cargo: any; }) => {
          return {
            value: data.IdCargo,
            label: data.Cargo
          };
        });
      }));
    } catch (err: any) {
      SweetAlert.fire({
        icon: 'error',
        title: 'ERROR',
        text: `Se produjo el siguiente error: ${ err }`,
        showConfirmButton: true,
        confirmButtonText: 'Aceptar'
      });
    }
  }

  private _getDivisiones(): void {
    try {
      this._supervisoresSvc.subscription.push(this._divisionesSvc.getDivisiones().subscribe(response => {
        const result = response.getAllDivisiones;

        if (!result.success) {
          return SweetAlert.fire({
            icon: 'error',
            title: 'ERROR',
            text: `Se produjo el siguiente error: ${ result.error }`,
            showConfirmButton: true,
            confirmButtonText: 'Aceptar'
          });
        }

        this.divisionesValues = result.data.map((data: { IdDivision: string; Division: string; }) => {
          return {
            value: data.IdDivision,
            label: data.IdDivision + '-' + data.Division
          };
        });
      }));
    } catch (err: any) {
      SweetAlert.fire({
        icon: 'error',
        title: 'ERROR',
        text: `Se produjo el siguiente error: ${ err }`,
        showConfirmButton: true,
        confirmButtonText: 'Aceptar'
      });
    }
  }

  get isSuperAdmin(): boolean {
    return this._usuarioSvc.hasSuperAdminPermission();
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
    this._supervisoresSvc.subscription.push(this._supervisoresSvc.save().subscribe(response => {
      let result;
      let txtMessage;

      if (this.action === ActionClicked.Add) {
        result = response.createSupervisor
        txtMessage = 'El Supervisor se ha creado correctamente.';
      } else {
        result = response.updateSupervisor
        txtMessage = 'El Supervisor se ha actualizado correctamente.';
      }
      
      if (!result.success) {
        return SweetAlert.fire({
          icon: 'error',
          title: 'ERROR',
          text: result.error,
          showConfirmButton: true,
          confirmButtonText: 'Aceptar'
        });
      }

      this._closeModal(txtMessage);
    }));
  }

  private _closeModal(message?: string): void {
    this._dinamicDialogSvc.close(message);
  }

}

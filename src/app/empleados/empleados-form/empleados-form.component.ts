import { CargosService } from './../../shared/services/cargos.service';
import { MutationActions } from './../../shared/models/mutation-response';
import { DivisionesService } from './../../shared/services/divisiones.service';
import { ETipoUsuarios } from './../../usuarios/shared/models/usuarios.model';
import { UsuarioService } from '../../shared/services/usuario.service';
import { toNumber } from 'lodash';
import { ModalService } from './../../shared/services/modal.service';
import { EmpleadosService } from './../shared/services/empleados.service';
import { MyErrorStateMatcher } from '../../angular-material/models/material-error-state-matcher';
import { ISelectableOptions } from './../../shared/models/selectable-item';
import { FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { SweetalertService } from '../../shared/services/sweetalert.service';

@Component({
  selector: 'app-empleados-form',
  templateUrl: './empleados-form.component.html',
  styleUrls: ['./empleados-form.component.scss']
})
export class EmpleadosFormComponent implements OnInit {
  action: MutationActions;

  fg: FormGroup;

  divisionesValues: ISelectableOptions[];

  cargosValues: ISelectableOptions[];

  matcher = new MyErrorStateMatcher();

  constructor(
    private _usuarioSvc: UsuarioService,
    private _empleadosSvc: EmpleadosService,
    private _cargosSvc: CargosService,
    private _modalSvc: ModalService,
    private _divisionesSvc: DivisionesService,
    private _sweetAlterSvc: SweetalertService
  ) { }

  ngOnInit(): void {
    this.fg = this._empleadosSvc.fg;
    this.action = toNumber(this.fg.controls['idEmpleado'].value) === 0 ? 'Agregar' : 'Modificar';

    this._getCargos();

    this._getDivisiones();
  }

  private _getCargos(): void {
    try {
      this._usuarioSvc.subscription.push(this._cargosSvc.getCargos().subscribe(response => {
        const result = response.getAllCargos;

        if (!result.success) {
          return this._sweetAlterSvc.error(`Se produjo el siguiente error: ${ result.error }`);
        }

        this.cargosValues = result.data.map((data: { IdCargo: any; Cargo: any; }) => {
          return {
            value: data.IdCargo,
            description: data.Cargo
          };
        });
      }));
    } catch (err: any) {
      this._sweetAlterSvc.error(`Se produjo el siguiente error: ${ err }`);
    }
  }

  private _getDivisiones(): void {
    try {
      this._usuarioSvc.subscription.push(this._divisionesSvc.getDivisiones().subscribe(response => {
        const result = response.getAllDivisiones;

        if (!result.success) {
          return this._sweetAlterSvc.error(`Se produjo el siguiente error: ${ result.error }`);
        }

        this.divisionesValues = result.data.map((data: { IdDivision: string; Division: string; }) => {
          return {
            value: data.IdDivision,
            description: data.IdDivision + '-' + data.Division
          };
        });
      }));
    } catch (err: any) {
      this._sweetAlterSvc.error(`Se produjo el siguiente error: ${ err }`);
    }
  }

  get isSuperAdmin(): boolean {
    return this._usuarioSvc.hasSuperAdminPermission();
  }

  save(): void {
    this._usuarioSvc.subscription.push(this._empleadosSvc.save().subscribe(response => {
      const result = response.saveEmpleado;

      if (!result.success) {
        return this._sweetAlterSvc.error(`Se produjo el siguiente error: ${ result.error }`);
      }

      let txtMessage;
      if (this.action === 'Agregar') {
        txtMessage = 'El Empleado se ha creado correctamente.';
      } else {
        txtMessage = 'El Empleado se ha actualizado correctamente.';
      }

      this.closeModal();

      // this._materialSvc.openSnackBar(txtMessage);
      this._sweetAlterSvc.success(txtMessage);
    }));
  }

  closeModal(): void {
    this._modalSvc.closeModal();
  }

}

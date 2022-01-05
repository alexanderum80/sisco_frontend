import { CargosService } from './../../shared/services/cargos.service';
import { MutationActions } from './../../shared/models/mutation-response';
import { DivisionesService } from './../../shared/services/divisiones.service';
import { ETipoUsuarios } from './../../usuarios/shared/models/usuarios.model';
import SweetAlert from 'sweetalert2';
import { toNumber } from 'lodash';
import { MaterialService } from './../../shared/services/material.service';
import { ModalService } from './../../shared/services/modal.service';
import { SupervisoresService } from './../shared/services/supervisores.service';
import { UsuarioService } from './../../shared/services/usuario.service';
import { MyErrorStateMatcher } from '../../angular-material/models/material-error-state-matcher';
import { ISelectableOptions } from './../../shared/models/selectable-item';
import { FormGroup } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-supervisores-form',
  templateUrl: './supervisores-form.component.html',
  styleUrls: ['./supervisores-form.component.scss']
})
export class SupervisoresFormComponent implements OnInit, OnDestroy {
  action: MutationActions;

  fg: FormGroup;

  divisionesValues: ISelectableOptions[];

  cargosValues: ISelectableOptions[];

  matcher = new MyErrorStateMatcher();

  subscription: Subscription[] = [];

  constructor(
    private _usuarioSvc: UsuarioService,
    private _divisionesSvc: DivisionesService,
    private _supervisoresSvc: SupervisoresService,
    private _cargosSvc: CargosService,
    private _modalSvc: ModalService,
    private _materialSvc: MaterialService
  ) { }

  ngOnInit(): void {
    this.fg = this._supervisoresSvc.fg;
    this.action = toNumber(this.fg.controls['idSupervisor'].value) === 0 ? 'Agregar' : 'Modificar';

    this._getCargos();

    this._getDivisiones();
  }

  ngOnDestroy(): void {
    this.subscription.forEach(subs => subs.unsubscribe());
  }

  private _getCargos(): void {
    try {
      this.subscription.push(this._cargosSvc.getCargos().subscribe(response => {
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
            description: data.Cargo
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
      this.subscription.push(this._divisionesSvc.getDivisiones().subscribe(response => {
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
            description: data.IdDivision + '-' + data.Division
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

  save(): void {
    this.subscription.push(this._supervisoresSvc.save().subscribe(response => {
      const result = response.saveSupervisor;
      if (!result.success) {
        return SweetAlert.fire({
          icon: 'error',
          title: 'ERROR',
          text: result.error,
          showConfirmButton: true,
          confirmButtonText: 'Aceptar'
        });
      }

      let txtMessage;
      if (this.action === 'Agregar') {
        txtMessage = 'El Supervisor se ha creado correctamente.';
      } else {
        txtMessage = 'El Supervisor se ha actualizado correctamente.';
      }

      this.closeModal();

      this._materialSvc.openSnackBar(txtMessage);
    }));
  }

  closeModal(): void {
    this._modalSvc.closeModal();
  }

}

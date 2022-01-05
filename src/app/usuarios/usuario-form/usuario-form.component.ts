import { MutationActions } from './../../shared/models/mutation-response';
import { DivisionesService } from './../../shared/services/divisiones.service';
import { ETipoUsuarios } from './../shared/models/usuarios.model';
import { Subscription } from 'rxjs';
import { DivisionesQueryResponse } from './../../shared/models/divisiones';
import { MaterialService } from '../../shared/services/material.service';
import { MyErrorStateMatcher } from '../../angular-material/models/material-error-state-matcher';
import { ISelectableOptions } from '../../shared/models/selectable-item';
import { UsuariosMutationResponse, TipoUsuarios } from '../shared/models/usuarios.model';
import SweetAlert from 'sweetalert2';
import { usuariosApi } from '../shared/graphql/usuarioActions.gql';
import { Apollo } from 'apollo-angular';
import { ModalService } from '../../shared/services/modal.service';
import { UsuarioService } from '../../shared/services/usuario.service';
import { FormGroup } from '@angular/forms';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { IUsuario } from 'src/app/shared/models';
import { toNumber } from 'lodash';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-usuario-form',
  templateUrl: './usuario-form.component.html',
  styleUrls: ['./usuario-form.component.scss']
})
export class UsuarioFormComponent implements OnInit, OnDestroy {
  action: MutationActions;

  fg: FormGroup;

  tipoUsuariosValues = TipoUsuarios;

  divisionesValues: ISelectableOptions[];

  cargosValues: ISelectableOptions[];

  matcher = new MyErrorStateMatcher();

  subscription: Subscription[] = [];

  constructor(
    private _usuarioSvc: UsuarioService,
    private _modalSvc: ModalService,
    private _apollo: Apollo,
    private _materialSvc: MaterialService,
    private _divisionesSvc: DivisionesService
  ) { }

  ngOnInit(): void {
    this.fg = this._usuarioSvc.fg;
    this.action = toNumber(this.fg.controls['idUsuario'].value) === 0 ? 'Agregar' : 'Modificar';

    this._getCargos();

    this._getDivisiones();

    this._subscribeToFgChanges();
  }

  ngOnDestroy(): void {
    this.subscription.forEach(subs => subs.unsubscribe());
  }

  private _getCargos(): void {
    try {
      this.cargosValues = TipoUsuarios.map(c => {
        return {
          value: c.value,
          description: c.description
        };
      });
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

  private _subscribeToFgChanges(): void {
    this.fg.controls['contrasena'].valueChanges.subscribe(value => {
      if (value.length === 0) {
        this.fg.controls['contrasena'].setErrors({ required: true });
      } else if (value.length < 6) {
        this.fg.controls['contrasena'].setErrors({ minLength: true });
      } else {
        this.fg.controls['contrasena'].setErrors(null);
      }
    });

    this.fg.controls['contrasenaConfirm'].valueChanges.subscribe(value => {
      if (value.length === 0) {
        this.fg.controls['contrasenaConfirm'].setErrors({required: true });
      } else if (value.length < 6) {
        this.fg.controls['contrasenaConfirm'].setErrors({minLength: true });
      } else {
        this.fg.controls['contrasenaConfirm'].setErrors(null);
      }
    });

    this.fg.controls['tipoUsuario'].valueChanges.subscribe(() => {
      this.fg.controls['contrasenaAvanzada'].setErrors(null);
    });
  }

  get isSuperAdmin(): boolean {
    return this._usuarioSvc.hasSuperAdminPermission();
  }

  get isUsuarioAvanzado(): boolean {
    return this.fg.get('tipoUsuario')?.value === ETipoUsuarios['Usuario Avanzado'];
  }

  save(): void {
    if (this.fg.controls['contrasena'].value !== this.fg.controls['contrasenaConfirm'].value) {
      SweetAlert.fire({
        icon: 'error',
        title: 'Error al Validar',
        text: 'Las contraseñas introducidas no coinciden. Rectifique.',
        showConfirmButton: true,
        confirmButtonText: 'OK'
      });

      return;
    }

    const usuarioInfo: IUsuario = {
      IdUsuario: toNumber(this.fg.controls['idUsuario'].value),
      Usuario: this.fg.controls['usuario'].value,
      Contrasena: this.fg.controls['contrasena'].value,
      IdTipoUsuario: this.fg.controls['tipoUsuario'].value,
      CambiarContrasena: this.fg.controls['cambiarContrasena'].value,
      ContrasenaAvanzada: this.fg.controls['contrasenaAvanzada'].value,
      IdDivision: toNumber(this.fg.controls['idDivision'].value),
    };

    const usuarioMutation = usuarioInfo.IdUsuario === 0 ? usuariosApi.create : usuariosApi.update;

    this.subscription.push(this._apollo.mutate<UsuariosMutationResponse>({
      mutation: usuarioMutation,
      variables: { usuarioInfo },
      refetchQueries: ['GetAllUsuarios']
    }).subscribe(response => {
      let result;
      let txtMessage;

      if (usuarioInfo.IdUsuario === 0) {
        result = response.data?.createUsuario;
        txtMessage = 'El Usuario se ha creado correctamente.';
      } else {
        result = response.data?.updateUsuario;
        txtMessage = 'El Usuario se ha actualizado correctamente.';
      }

      if (!result?.success) {
        return SweetAlert.fire({
          icon: 'error',
          title: 'ERROR',
          text: result?.error,
          showConfirmButton: true,
          confirmButtonText: 'Aceptar'
        });
      }

      this.closeModal();

      // this._materialSvc.openSnackBar(txtMessage);
      Swal.fire({
        position: 'top-right',
        icon: 'success',
        title: txtMessage,
        showConfirmButton: false,
        timer: 1500
      });
    }));
  }

  closeModal(): void {
    this._modalSvc.closeModal();
  }

}

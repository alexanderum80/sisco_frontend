import { DinamicDialogService } from 'src/app/shared/ui/prime-ng/dinamic-dialog/dinamic-dialog.service';
import { SweetalertService } from './../../shared/services/sweetalert.service';
import { TipoUsuariosService } from './../../shared/services/tipo-usuarios.service';
import { SelectItem } from 'primeng/api';
import { ActionClicked } from './../../shared/models/list-items';
import { DivisionesService } from './../../shared/services/divisiones.service';
import { ETipoUsuarios } from './../shared/models/usuarios.model';
import { UsuariosMutationResponse } from '../shared/models/usuarios.model';
import SweetAlert from 'sweetalert2';
import { usuariosApi } from '../shared/graphql/usuarioActions.gql';
import { Apollo } from 'apollo-angular';
import { UsuarioService } from '../../shared/services/usuario.service';
import { FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { IUsuario } from 'src/app/shared/models';
import { toNumber } from 'lodash';

@Component({
  selector: 'app-usuario-form',
  templateUrl: './usuario-form.component.html',
  styleUrls: ['./usuario-form.component.scss']
})
export class UsuarioFormComponent implements OnInit {
  action: ActionClicked;

  fg: FormGroup;

  divisionesValues: SelectItem[] = [];

  tipoUsuariosValues: SelectItem[] = [];

  constructor(
    private _usuarioSvc: UsuarioService,
    private _dinamicDialogSvc: DinamicDialogService,
    private _apollo: Apollo,
    private _tipoUsuariosSvc: TipoUsuariosService,
    private _divisionesSvc: DivisionesService,
    private _sweetAlterSvc: SweetalertService
  ) { }

  ngOnInit(): void {
    this.fg = this._usuarioSvc.fg;

    this._getTipoUsuarios();

    this._getDivisiones();

    this._subscribeToFgChanges();
  }

  private _getTipoUsuarios(): void {
    try {
      this._usuarioSvc.subscription.push(this._tipoUsuariosSvc.getAllTipoUsuarios().subscribe(response => {
        const result = response.getAllTipoUsuarios;

        this.tipoUsuariosValues = result.data.map((c: { IdTipo: any; TipoUsuario: any; }) => {
          return {
            value: c.IdTipo,
            label: c.TipoUsuario
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
      this._usuarioSvc.subscription.push(this._divisionesSvc.getDivisiones().subscribe(response => {
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

        this.divisionesValues = result.data.map((d: { IdDivision: number; Division: string; }) => {
          return {
            value: d.IdDivision,
            label: d.IdDivision + '-' + d.Division
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

    this._usuarioSvc.subscription.push(this._apollo.mutate<UsuariosMutationResponse>({
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
        return this._sweetAlterSvc.error(`Se produjo el siguiente error: ${ result?.error }`);
      }

      this._closeModal(txtMessage);
    }));
  }

  private _closeModal(message?: string): void {
    this._dinamicDialogSvc.close(message);
  }

}

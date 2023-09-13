import { AuthenticationService } from './../../../shared/services/authentication.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';

import { Subscription, Observable } from 'rxjs';
import {
  UsuariosMutationResponse,
  UsuariosQueryResponse,
} from '../models/usuarios.model';
import { usuariosApi } from '../graphql/usuarioActions.gql';
import { IUsuario } from 'src/app/shared/models';
import { toNumber } from 'lodash';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  subscription: Subscription[] = [];

  fg = new FormGroup({
    idUsuario: new FormControl(0, { initialValueIsDefault: true }),
    usuario: new FormControl('', { initialValueIsDefault: true }),
    contrasena: new FormControl('', {
      validators: Validators.minLength(6),
      initialValueIsDefault: true,
    }),
    contrasenaConfirm: new FormControl('', {
      validators: Validators.minLength(6),
      initialValueIsDefault: true,
    }),
    tipoUsuario: new FormControl(null, { initialValueIsDefault: true }),
    cambiarContrasena: new FormControl(false, { initialValueIsDefault: true }),
    contrasenaAvanzada: new FormControl('', { initialValueIsDefault: true }),
    idDivision: new FormControl(null, { initialValueIsDefault: true }),
  });

  constructor(
    private _apollo: Apollo,
    private _authSvc: AuthenticationService
  ) {}

  getUsuarios(): Observable<UsuariosQueryResponse> {
    return new Observable<UsuariosQueryResponse>(subscriber => {
      const _query = this._authSvc.hasSuperAdminPermission()
        ? usuariosApi.all
        : usuariosApi.byDivision;

      const payload = this._authSvc.hasSuperAdminPermission()
        ? {}
        : { idDivision: this._authSvc.usuario.IdDivision };

      this.subscription.push(
        this._apollo
          .watchQuery<UsuariosQueryResponse>({
            query: _query,
            variables: payload,
            fetchPolicy: 'network-only',
          })
          .valueChanges.subscribe({
            next: res => {
              subscriber.next(res.data);
            },
            error: err => {
              subscriber.error(err.message || err);
            },
          })
      );
    });
  }

  save(): Observable<UsuariosMutationResponse> {
    return new Observable<UsuariosMutationResponse>(subscriber => {
      try {
        const usuarioInfo: IUsuario = {
          IdUsuario: toNumber(this.fg.controls['idUsuario'].value),
          Usuario: this.fg.controls['usuario'].value.toLowerCase(),
          Contrasena: this.fg.controls['contrasena'].value,
          IdTipoUsuario: this.fg.controls['tipoUsuario'].value,
          CambiarContrasena: this.fg.controls['cambiarContrasena'].value,
          ContrasenaAvanzada: this.fg.controls['contrasenaAvanzada'].value,
          IdDivision: toNumber(this.fg.controls['idDivision'].value),
        };

        const usuarioMutation =
          usuarioInfo.IdUsuario === 0 ? usuariosApi.create : usuariosApi.update;

        this.subscription.push(
          this._apollo
            .mutate<UsuariosMutationResponse>({
              mutation: usuarioMutation,
              variables: { usuarioInfo },
              refetchQueries: ['GetAllUsuarios'],
            })
            .subscribe({
              next: res => {
                subscriber.next(res.data!);
              },
              error: err => {
                subscriber.error(err);
              },
            })
        );
      } catch (err: any) {
        subscriber.error(err.message || err);
      }
    });
  }

  unsubscribe(): void {
    this.subscription.forEach(s => {
      if (s && !s.closed && typeof s.unsubscribe === 'function') {
        s.unsubscribe();
      }
    });
  }
}

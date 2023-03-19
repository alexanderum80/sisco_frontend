import { AuthenticationService } from './../../../shared/services/authentication.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';

import { Subscription, Observable } from 'rxjs';
import { UsuariosQueryResponse } from '../models/usuarios.model';
import { usuariosApi } from '../graphql/usuarioActions.gql';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  subscription: Subscription[] = [];

  fg = new FormGroup({
    idUsuario: new FormControl(''),
    usuario: new FormControl(''),
    contrasena: new FormControl('', Validators.minLength(6)),
    contrasenaConfirm: new FormControl('', Validators.minLength(6)),
    tipoUsuario: new FormControl(''),
    cambiarContrasena: new FormControl(false),
    contrasenaAvanzada: new FormControl(''),
    idDivision: new FormControl(''),
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

  unsubscribe(): void {
    this.subscription.forEach(s => {
      if (s && !s.closed && typeof s.unsubscribe === 'function') {
        s.unsubscribe();
      }
    });
  }
}

import {
  UsuariosQueryResponse,
  ETipoUsuarios,
} from './../../usuarios/shared/models/usuarios.model';
import { usuariosApi } from './../../usuarios/shared/graphql/usuarioActions.gql';
import { Usuario } from './../models/usuarios';
import { ApolloService } from '../helpers/apollo.service';
import { IUsuario } from 'src/app/shared/models';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private _allowAction: boolean;

  private _usuarioSubject = new BehaviorSubject<IUsuario | null>(null);

  constructor(private _router: Router, private _apolloSvc: ApolloService) {}

  get authenticated(): boolean {
    return this._usuarioSubject.value ? true : false;
  }

  get usuario(): IUsuario {
    return this._usuarioSubject.value!;
  }

  get usuario$(): Observable<IUsuario | null> {
    return this._usuarioSubject.asObservable();
  }

  login(authVariables: any): Observable<UsuariosQueryResponse> {
    return new Observable<UsuariosQueryResponse>(subscriber => {
      this._apolloSvc
        .query<UsuariosQueryResponse>(usuariosApi.authenticate, {
          usuario: authVariables.Usuario,
          passw: authVariables.Contrasena,
        })
        .subscribe({
          next: res => {
            this.udpateUsuario(res.authenticateUsuario);

            subscriber.next(res);
          },
          error: err => {
            subscriber.error(err.message || err);
          },
        });
    });
  }

  udpateUsuario(usuario: IUsuario | null): void {
    const _usuario = usuario ? new Usuario(usuario) : null;
    this._usuarioSubject.next(_usuario);
  }

  // private _refreshToken(): void {
  //   if (this.usuario) {
  //     setTimeout({}, 90000);
  //   }
  // }

  logout(): void {
    localStorage.clear();
    this._usuarioSubject.next(null);
    this._router.navigate(['login']);
  }

  hasAdminPermission(): boolean {
    const currentUsuario = this._usuarioSubject.value;

    if (!currentUsuario) {
      return false;
    }

    const isOwner = currentUsuario.Usuario === 'alexanderu';
    if (isOwner) {
      this._allowAction = true;
    } else {
      this._allowAction =
        currentUsuario.IdTipoUsuario === ETipoUsuarios.Administrador
          ? true
          : false;
    }

    return this._allowAction;
  }

  hasSuperAdminPermission(): boolean {
    const currentUsuario = this._usuarioSubject.value;

    if (!currentUsuario) {
      return false;
    }

    const isOwner = currentUsuario.Usuario === 'alexanderu';
    if (isOwner) {
      this._allowAction = true;
    } else {
      // tslint:disable-next-line: max-line-length
      this._allowAction =
        currentUsuario.IdTipoUsuario === ETipoUsuarios.Administrador &&
        currentUsuario.IdDivision === 100
          ? true
          : false;
    }

    return this._allowAction;
  }

  hasAdvancedUserPermission(): boolean {
    const currentUsuario = this._usuarioSubject.value;

    if (!currentUsuario) {
      return false;
    }

    const isOwner = currentUsuario.Usuario === 'alexanderu';
    if (isOwner) {
      this._allowAction = true;
    } else {
      // tslint:disable-next-line: max-line-length
      this._allowAction =
        currentUsuario.IdTipoUsuario === ETipoUsuarios['Usuario Avanzado'] &&
        currentUsuario.IdDivision === 100
          ? true
          : false;
    }

    return this._allowAction;
  }

  hasFinancistaPermission(): boolean {
    const currentUsuario = this._usuarioSubject.value;

    if (!currentUsuario) {
      return false;
    }

    const isOwner = currentUsuario.Usuario === 'alexanderu';
    if (isOwner) {
      this._allowAction = true;
    } else {
      // tslint:disable-next-line: max-line-length
      this._allowAction =
        currentUsuario.IdTipoUsuario === ETipoUsuarios.Financista &&
        currentUsuario.IdDivision === 100
          ? true
          : false;
    }

    return this._allowAction;
  }
}

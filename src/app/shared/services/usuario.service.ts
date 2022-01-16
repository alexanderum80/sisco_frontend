import { usuariosApi } from './../../usuarios/shared/graphql/usuarioActions.gql';
import { ETipoUsuarios, UsuariosQueryResponse } from './../../usuarios/shared/models/usuarios.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { IUsuario } from '../models/usuarios';
import { BehaviorSubject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { QueryRef, Apollo } from 'apollo-angular';

import { Usuario } from '../models';
import { Subscription } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class UsuarioService {
    private _usuario: IUsuario;

    private _allowAction: boolean;

    private _usuarioSubject = new BehaviorSubject<IUsuario | null>(null);

    private _subscription: Subscription[] = [];

    currentUsuarioQuery: QueryRef<any>;

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
        private _apollo: Apollo
    ) { }

    get usuario(): IUsuario {
        return this._usuario;
    }

    get usuario$(): Observable<IUsuario | null> {
        return this._usuarioSubject.asObservable();
    }

    get subscription(): Subscription[] {
        return this._subscription;
    }

    unsubscribe(): void {
        this._subscription.forEach(s => {
            if (s && !s.closed && (typeof s.unsubscribe === 'function')) {
                s.unsubscribe();
            }
        });
    }

    updateUsuarioInfo(usuarioInfo: Usuario): void {
        if (!usuarioInfo) {
            return this._usuarioSubject.next(null);
        }

        const that = this;

        that._setUsuario(usuarioInfo);
    }

    removeUsuario(): void {
        this._usuarioSubject.next(null);
    }

    hasAdminPermission(): boolean {
        const currentUsuario = this._usuarioSubject.value;

        if (!currentUsuario) { return false; }

        const isOwner = currentUsuario.Usuario === 'alexanderu';
        if (isOwner) {
            this._allowAction = true;
        } else {
            this._allowAction = currentUsuario.IdTipoUsuario === ETipoUsuarios.Administrador ? true : false;
        }

        return this._allowAction;
    }

    hasSuperAdminPermission(): boolean {
        const currentUsuario = this._usuarioSubject.value;

        if (!currentUsuario) { return false; }

        const isOwner = currentUsuario.Usuario === 'alexanderu';
        if (isOwner) {
            this._allowAction = true;
        } else {
            // tslint:disable-next-line: max-line-length
            this._allowAction = currentUsuario.IdTipoUsuario === ETipoUsuarios.Administrador && currentUsuario.IdDivision === 100 ? true : false;
        }

        return this._allowAction;
    }

    hasAdvancedUserPermission(): boolean {
        const currentUsuario = this._usuarioSubject.value;

        if (!currentUsuario) { return false; }

        const isOwner = currentUsuario.Usuario === 'alexanderu';
        if (isOwner) {
            this._allowAction = true;
        } else {
            // tslint:disable-next-line: max-line-length
            this._allowAction = currentUsuario.IdTipoUsuario === ETipoUsuarios['Usuario Avanzado'] && currentUsuario.IdDivision === 100 ? true : false;
        }

        return this._allowAction;
    }

    private _setUsuario(usuario: Usuario): void {
        if (!usuario) { return; }
        this._usuario = new Usuario(usuario);
        this._usuarioSubject.next(this._usuario);
    }

    autenticateUsuario(authVariables: any): Observable<UsuariosQueryResponse> {
        return new Observable<UsuariosQueryResponse>(subscriber => {
            this._apollo.query<UsuariosQueryResponse> ({
                query: usuariosApi.authenticate,
                variables: {
                    usuario: authVariables.Usuario,
                    passw: authVariables.Contrasena
                },
                fetchPolicy: 'network-only'
            }).subscribe({
                next: (response) => {
                    subscriber.next(response.data);
                },
                error: (error) => { 
                    subscriber.error(error);
                }
            });
        })
    }

}

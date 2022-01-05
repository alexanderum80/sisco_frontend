import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { isBoolean } from 'lodash';
import { UsuarioService } from './usuario.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthenticationService {
    private _authenticatedSubject = new BehaviorSubject <boolean> (false);

    private _owner = false;
    private _ownerSubject = new BehaviorSubject<boolean>(this._owner);

    constructor(
        private _router: Router,
        private _usuarioSvc: UsuarioService
    ) {}

    get authenticated(): boolean {
        return this._authenticatedSubject.getValue();
    }

    get owner(): boolean {
        return this._owner;
    }

    get owner$(): Observable<boolean> {
        return this._ownerSubject.asObservable();
    }

    setOwner(isOwner: boolean): void {
        if (!isBoolean(isOwner)) {
            return;
        }

        this._owner = isOwner;
        this._ownerSubject.next(isOwner);
    }

    login(): void {
        this._authenticated = true;
    }

    logout(): void {
        this._authenticated = false;
        this._usuarioSvc.removeUsuario();
        this._usuarioSvc.unsubscribe();
        this._router.navigate(['login']);
    }

    get authenticated$(): Observable < boolean > {
        return this._authenticatedSubject.asObservable();
    }

    private set _authenticated(authenticated: boolean) {
        this._authenticatedSubject.next(authenticated);
    }
}

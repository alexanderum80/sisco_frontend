import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

export interface RouteAccess {
  id: number;
  shouldActivate: boolean;
  state: any;
  url: string;
  urlAfterRedirects: any;
}

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  hasAccess = true;

  constructor(
    private _router: Router,
    private _authenticationSvc: AuthenticationService
  ) {}

  canActivate(
    activatedRoute: ActivatedRouteSnapshot,
    routerStateSnapshot: RouterStateSnapshot
  ): boolean {
    localStorage.removeItem('usuario');
    // const _localStorage = localStorage.getItem('usuario');
    // if (_localStorage)
    //   this._authenticationSvc.udpateUsuario(JSON.parse(_localStorage));

    if (!this._authenticationSvc.authenticated) {
      if (routerStateSnapshot.url === '/') {
        this._router.navigate(['/login']);
      } else {
        this._router.navigate(['/login'], {
          queryParams: { continue: routerStateSnapshot.url },
        });
      }
      return false;
    }

    return true;
  }
}

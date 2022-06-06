import { Injectable, Injector } from '@angular/core';
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthenticationService } from './authentication.service';
import { UsuarioService } from './usuario.service';

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
    private _authenticationSvc: AuthenticationService,
    private _usuarioSvc: UsuarioService,
    private _injector: Injector
  ) {}

  canActivate(
    activatedRoute: ActivatedRouteSnapshot,
    routerStateSnapshot: RouterStateSnapshot
  ): boolean {
    if (!this._authenticationSvc.authenticated || !this._usuarioSvc.usuario) {
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

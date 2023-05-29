import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

export class RoleGuard {
  static forRoles(...roles: number[]) {
    @Injectable({
      providedIn: 'root',
    })
    class RoleCheck implements CanActivate {
      constructor(private authService: AuthenticationService) {}
      canActivate(): Observable<boolean> | Promise<boolean> | boolean {
        const userRole = this.authService.usuario.IdTipoUsuario;

        return roles.includes(userRole);
      }
    }

    return RoleCheck;
  }
}

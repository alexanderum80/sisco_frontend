import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { UsuarioService } from '../../shared/services/usuario.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private authenticationService: UsuarioService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // add auth header with jwt if user is logged in and request is to the api url
    const usuario = this.authenticationService.usuario || null;
    if (usuario) {
      request = request.clone({
        setHeaders: { Authorization: `Bearer ${usuario.Token}` },
      });
    }

    return next.handle(request);
  }
}

import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from './../services/authentication.service';
import { map, Observable } from 'rxjs';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class HTTPResponseInterceptor implements HttpInterceptor {
  constructor(
    private _authSvc: AuthenticationService,
    private _toastrSvc: ToastrService
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      map(event => {
        if (event instanceof HttpResponse) {
          if (
            event.body.errors &&
            event.body.errors.length &&
            event.body.errors[0].extensions?.response?.statusCode === 403
          ) {
            this._authSvc.logout();

            this._toastrSvc.warning(
              'Su sesión ha expirado. Debe iniciar sesión nuevamente.',
              'Sesión caducada'
            );
          }
        }
        return event;
      })
    );
  }
}

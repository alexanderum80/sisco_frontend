import {
  HttpEvent,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';

@Injectable()
export class HttpErrorInterceptorService extends HttpErrorResponse {
  constructor() {
    super({});
  }
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((httpErrorResponse: HttpErrorResponse) => {
        let errorMesagge = '';

        if (httpErrorResponse.error instanceof ErrorEvent) {
          errorMesagge = httpErrorResponse.error.error;
        } else {
          if (httpErrorResponse.status === 0) {
            errorMesagge = 'No hay conexión con el servidor';
          } else {
            errorMesagge = `${httpErrorResponse.status}: ${httpErrorResponse.error.error}`;
          }
        }
        return throwError(() => new Error(errorMesagge));
      })
    );
  }
}

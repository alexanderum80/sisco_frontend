import { unidadesApi } from './../graphql/unidadesApi';
import { UnidadesQueryResponse } from './../models/unidades.model';
import { Apollo } from 'apollo-angular';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'any',
})
export class UnidadesService {
  constructor(private _apollo: Apollo) {}

  getAllUnidades(): Observable<UnidadesQueryResponse> {
    return new Observable<UnidadesQueryResponse>(subscriber => {
      try {
        this._apollo
          .query<UnidadesQueryResponse>({
            query: unidadesApi.all,
            fetchPolicy: 'network-only',
          })
          .subscribe({
            next: res => {
              subscriber.next(res.data);
            },
            error: err => {
              subscriber.error(err.message || err);
            },
          });
      } catch (err: any) {
        subscriber.error(err.message || err);
      }
    });
  }

  getAllUnidadesByUsuario(): Observable<UnidadesQueryResponse> {
    return new Observable<UnidadesQueryResponse>(subscriber => {
      try {
        this._apollo
          .query<UnidadesQueryResponse>({
            query: unidadesApi.allByUsuario,
            fetchPolicy: 'network-only',
          })
          .subscribe({
            next: res => {
              subscriber.next(res.data);
            },
            error: err => {
              subscriber.error(err.message || err);
            },
          });
      } catch (err: any) {
        subscriber.error(err.message || err);
      }
    });
  }

  getUnidadesByIdSubdivision(
    idSubdivision: number
  ): Observable<UnidadesQueryResponse> {
    return new Observable<UnidadesQueryResponse>(subscriber => {
      try {
        this._apollo
          .query<UnidadesQueryResponse>({
            query: unidadesApi.byIdSubdivision,
            variables: { idSubdivision },
            fetchPolicy: 'network-only',
          })
          .subscribe({
            next: res => {
              subscriber.next(res.data);
              subscriber.complete();
            },
            error: err => {
              subscriber.error(err.message || err);
            },
          });
      } catch (err: any) {
        subscriber.error(err.message || err);
      }
    });
  }

  getUnidadesByIdDivision(
    idDivision: number
  ): Observable<UnidadesQueryResponse> {
    return new Observable<UnidadesQueryResponse>(subscriber => {
      try {
        this._apollo
          .query<UnidadesQueryResponse>({
            query: unidadesApi.byIdDivision,
            variables: { idDivision },
            fetchPolicy: 'network-only',
          })
          .subscribe({
            next: res => {
              subscriber.next(res.data);
              subscriber.complete();
            },
            error: err => {
              subscriber.error(err.message || err);
            },
          });
      } catch (err: any) {
        subscriber.error(err.message || err);
      }
    });
  }
}

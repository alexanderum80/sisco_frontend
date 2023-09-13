import { TipoUsuariosQueryResponse } from '../models/tipo-usuarios';
import { Observable } from 'rxjs';
import { Apollo } from 'apollo-angular';
import { Injectable } from '@angular/core';

const tipoUsuariosQuery = require('graphql-tag/loader!../graphql/tipo-usuarios.query.gql');

@Injectable({
  providedIn: 'root',
})
export class TipoUsuariosService {
  constructor(private _apollo: Apollo) {}

  getAllTipoUsuarios(): Observable<TipoUsuariosQueryResponse> {
    return new Observable<TipoUsuariosQueryResponse>(subscriber => {
      try {
        this._apollo
          .query<TipoUsuariosQueryResponse>({
            query: tipoUsuariosQuery,
            fetchPolicy: 'network-only',
          })
          .subscribe(res => {
            subscriber.next(res.data);
          });
      } catch (err: any) {
        subscriber.error(err.message || err);
      }
    });
  }
}

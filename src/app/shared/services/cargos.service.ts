import { Apollo } from 'apollo-angular';
import { CargosQueryResponse } from './../models/cargos';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const cargosQuery = require('graphql-tag/loader!../graphql/cargos.query.gql');

@Injectable({
  providedIn: 'root'
})
export class CargosService {

  constructor(
    private _apollo: Apollo,
  ) { }

  getCargos(): Observable<CargosQueryResponse> {
    return new Observable<CargosQueryResponse>(subscriber => {
      try {
        this._apollo.query<CargosQueryResponse>({
          query: cargosQuery,
          fetchPolicy: 'network-only'
        }).subscribe(response => {
          subscriber.next(response.data);
        });
      } catch (err: any) {
        subscriber.error(err);
      }
    });
  }
}

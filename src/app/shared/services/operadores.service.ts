import { OperadoresQueryResponse } from './../models/operadores';
import { Observable } from 'rxjs';
import { Apollo } from 'apollo-angular';
import { Injectable } from '@angular/core';

const operadoresQuery = require('graphql-tag/loader!../graphql/operadores.query.gql');

@Injectable({
  providedIn: 'root'
})
export class OperadoresService {
  constructor(
    private _apollo: Apollo,
  ) { }

  getCargos(): Observable<OperadoresQueryResponse> {
    return new Observable<OperadoresQueryResponse>(subscriber => {
      try {
        this._apollo.query<OperadoresQueryResponse>({
          query: operadoresQuery,
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

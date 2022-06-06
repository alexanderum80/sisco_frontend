import { Apollo } from 'apollo-angular';
import { DataBasesQueryResponse } from './../models/conexiones';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const dataBasesQuery = require('graphql-tag/loader!../graphql/databases.query.gql');

@Injectable({
  providedIn: 'root',
})
export class DatabasesService {
  constructor(private _apollo: Apollo) {}

  getDataBases(
    ip: string,
    usuario: string,
    password: string
  ): Observable<DataBasesQueryResponse> {
    return new Observable<DataBasesQueryResponse>(subscriber => {
      try {
        this._apollo
          .query<DataBasesQueryResponse>({
            query: dataBasesQuery,
            variables: {
              ip,
              usuario,
              password,
            },
            fetchPolicy: 'network-only',
          })
          .subscribe(response => {
            subscriber.next(response.data);
          });
      } catch (err: any) {
        subscriber.error(err);
      }
    });
  }
}

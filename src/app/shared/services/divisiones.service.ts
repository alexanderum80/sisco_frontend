import { Observable } from 'rxjs';
import { DivisionesQueryResponse } from './../models/divisiones';
import { Apollo } from 'apollo-angular';
import { Injectable } from '@angular/core';

const divisionesQuery = require('graphql-tag/loader!../graphql/divisiones.query.gql');

@Injectable({
  providedIn: 'root'
})
export class DivisionesService {

  constructor(
    private _apollo: Apollo,
  ) { }

  getDivisiones(): Observable<DivisionesQueryResponse> {
    return new Observable<DivisionesQueryResponse>(subscriber => {
      try {
        this._apollo.query<DivisionesQueryResponse>({
          query: divisionesQuery,
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

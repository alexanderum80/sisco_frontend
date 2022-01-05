import { SubdivisionesQueryResponse } from './../models/subdivisiones';
import { Apollo } from 'apollo-angular';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const subdivisionesQuery = require('graphql-tag/loader!../graphql/subdivisiones.query.gql');

@Injectable({
  providedIn: 'root'
})
export class SubdivisionesService {

  constructor(
    private _apollo: Apollo,
  ) { }

  getAllSubdivisiones(): Observable<SubdivisionesQueryResponse> {
    return new Observable<SubdivisionesQueryResponse>(subscriber => {
      try {
        this._apollo.query<SubdivisionesQueryResponse>({
          query: subdivisionesQuery,
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

import { SubdivisionesQueryResponse } from './../models/subdivisiones';
import { Apollo } from 'apollo-angular';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const allSubdivisionesQuery = require('graphql-tag/loader!../graphql/subdivisiones.query.gql');
const subdivisionesByIdDivisionQuery = require('graphql-tag/loader!../graphql/subdivisiones-by-idDivision.query.gql');

@Injectable({
  providedIn: 'root',
})
export class SubdivisionesService {
  constructor(private _apollo: Apollo) {}

  getAllSubdivisiones(): Observable<SubdivisionesQueryResponse> {
    return new Observable<SubdivisionesQueryResponse>(subscriber => {
      try {
        this._apollo
          .query<SubdivisionesQueryResponse>({
            query: allSubdivisionesQuery,
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

  getSubdivisionesByIdDivision(
    idDivision: number
  ): Observable<SubdivisionesQueryResponse> {
    return new Observable<SubdivisionesQueryResponse>(subscriber => {
      try {
        this._apollo
          .query<SubdivisionesQueryResponse>({
            query: subdivisionesByIdDivisionQuery,
            variables: { idDivision },
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

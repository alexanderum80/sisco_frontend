import { toNumber } from 'lodash';
import { supervisoresApi } from './../graphql/supervisores-api';
import { Apollo } from 'apollo-angular';
import {
  SupervisoresQueryResponse,
  SupervisoresMutationResponse,
  ISupervisor,
} from './../models/supervisores.model';
import { Observable, Subscription } from 'rxjs';
import { FormGroup, FormControl } from '@angular/forms';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SupervisoresService {
  fg = new FormGroup({
    idSupervisor: new FormControl(''),
    supervisor: new FormControl(''),
    cargo: new FormControl(''),
    division: new FormControl(''),
  });

  subscription: Subscription[] = [];

  constructor(private _apollo: Apollo) {}

  loadAllSupervisores(): Observable<SupervisoresQueryResponse> {
    return new Observable<SupervisoresQueryResponse>(subscriber => {
      try {
        this.subscription.push(
          this._apollo
            .watchQuery<SupervisoresQueryResponse>({
              query: supervisoresApi.all,
              fetchPolicy: 'network-only',
            })
            .valueChanges.subscribe({
              next: res => subscriber.next(res.data),
              error: err => subscriber.error(err.message || err),
            })
        );
      } catch (err: any) {
        subscriber.error(err.message || err);
      }
    });
  }

  loadSupervisorByIdDivision(
    idDivision: number
  ): Observable<SupervisoresQueryResponse> {
    return new Observable<SupervisoresQueryResponse>(subscriber => {
      try {
        this.subscription.push(
          this._apollo
            .query<SupervisoresQueryResponse>({
              query: supervisoresApi.byIdDivision,
              variables: { idDivision },
              fetchPolicy: 'network-only',
            })
            .subscribe({
              next: res => {
                subscriber.next(res.data);
                subscriber.complete();
              },
              error: err => subscriber.error(err.message || err),
            })
        );
      } catch (err: any) {
        subscriber.error(err.message || err);
      }
    });
  }

  loadSupervisorById(id: number): Observable<SupervisoresQueryResponse> {
    return new Observable<SupervisoresQueryResponse>(subscriber => {
      try {
        this.subscription.push(
          this._apollo
            .query<SupervisoresQueryResponse>({
              query: supervisoresApi.byId,
              variables: { id },
              fetchPolicy: 'network-only',
            })
            .subscribe({
              next: res => {
                subscriber.next(res.data);
                subscriber.complete();
              },
              error: err => subscriber.error(err.message || err),
            })
        );
      } catch (err: any) {
        subscriber.error(err.message || err);
      }
    });
  }

  save(): Observable<SupervisoresMutationResponse> {
    return new Observable<SupervisoresMutationResponse>(subscriber => {
      try {
        const supervisorInfo: ISupervisor = {
          IdSupervisor: toNumber(this.fg.controls['idSupervisor'].value),
          Supervisor: this.fg.controls['supervisor'].value,
          IdCargo: this.fg.controls['cargo'].value,
          IdDivision: toNumber(this.fg.controls['division'].value),
        };

        const mutation =
          supervisorInfo.IdSupervisor === 0
            ? supervisoresApi.create
            : supervisoresApi.update;

        this.subscription.push(
          this._apollo
            .mutate<SupervisoresMutationResponse>({
              mutation: mutation,
              variables: { supervisorInfo },
              refetchQueries: ['GetAllSupervisores'],
            })
            .subscribe({
              next: res => subscriber.next(res.data || undefined),
              error: err => subscriber.error(err.message || err),
            })
        );
      } catch (err: any) {
        subscriber.error(err.message || err);
      }
    });
  }

  delete(IDs: number[]): Observable<SupervisoresMutationResponse> {
    return new Observable<SupervisoresMutationResponse>(subscriber => {
      try {
        this.subscription.push(
          this._apollo
            .mutate<SupervisoresMutationResponse>({
              mutation: supervisoresApi.delete,
              variables: { IDs },
              refetchQueries: ['GetAllSupervisores'],
            })
            .subscribe({
              next: res => subscriber.next(res.data || undefined),
              error: err => subscriber.error(err.message || err),
            })
        );
      } catch (err: any) {
        subscriber.error(err.message || err);
      }
    });
  }

  dispose(): void {
    this.subscription.forEach(subs => subs.unsubscribe());
  }
}

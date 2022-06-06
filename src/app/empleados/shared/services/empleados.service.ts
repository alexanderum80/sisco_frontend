import { toNumber } from 'lodash';
import { empleadosApi } from './../graphql/empleados-api';
import {
  EmpleadosQueryResponse,
  IEmpleado,
  EmpleadosMutationResponse,
} from './../models/empleados.model';
import { Apollo } from 'apollo-angular';
import { FormGroup, FormControl } from '@angular/forms';
import { Injectable } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EmpleadosService {
  fg = new FormGroup({
    idEmpleado: new FormControl(''),
    empleado: new FormControl(''),
    cargo: new FormControl(''),
    division: new FormControl(''),
  });

  subscription: Subscription[] = [];

  constructor(private _apollo: Apollo) {}

  loadAllEmpleados(): Observable<EmpleadosQueryResponse> {
    return new Observable<EmpleadosQueryResponse>(subscriber => {
      try {
        this.subscription.push(
          this._apollo
            .watchQuery<EmpleadosQueryResponse>({
              query: empleadosApi.all,
              fetchPolicy: 'network-only',
            })
            .valueChanges.subscribe({
              next: response => subscriber.next(response.data || undefined),
              error: err => subscriber.error(err),
            })
        );
      } catch (err: any) {
        subscriber.error(err);
      }
    });
  }

  loadEmpleadoById(id: number): Observable<EmpleadosQueryResponse> {
    return new Observable<EmpleadosQueryResponse>(subscriber => {
      try {
        this.subscription.push(
          this._apollo
            .query<EmpleadosQueryResponse>({
              query: empleadosApi.byId,
              variables: { id },
              fetchPolicy: 'network-only',
            })
            .subscribe({
              next: (response) => {
                subscriber.next(response.data || undefined),
                  subscriber.complete();
              },
              error: err => subscriber.error(err),
            })
        );
      } catch (err: any) {
        subscriber.error(err);
      }
    });
  }

  save(): Observable<EmpleadosMutationResponse> {
    return new Observable<EmpleadosMutationResponse>(subscriber => {
      try {
        const empleadoInfo: IEmpleado = {
          IdEmpleado: toNumber(this.fg.controls['idEmpleado'].value),
          Empleado: this.fg.controls['empleado'].value,
          IdCargo: this.fg.controls['cargo'].value,
          IdDivision: toNumber(this.fg.controls['division'].value),
        };

        const mutation =
          empleadoInfo.IdEmpleado === 0
            ? empleadosApi.create
            : empleadosApi.update;

        this.subscription.push(
          this._apollo
            .mutate<EmpleadosMutationResponse>({
              mutation: mutation,
              variables: { empleadoInfo },
              refetchQueries: ['GetAllEmpleados'],
            })
            .subscribe({
              next: response => subscriber.next(response.data || undefined),
              error: err => subscriber.error(err),
            })
        );
      } catch (err: any) {
        subscriber.error(err);
      }
    });
  }

  delete(IDs: number[]): Observable<EmpleadosMutationResponse> {
    return new Observable<EmpleadosMutationResponse>(subscriber => {
      try {
        this.subscription.push(
          this._apollo
            .mutate<EmpleadosMutationResponse>({
              mutation: empleadosApi.delete,
              variables: { IDs },
              refetchQueries: ['GetAllEmpleados'],
            })
            .subscribe({
              next: response => subscriber.next(response.data || undefined),
              error: err => subscriber.error(err),
            })
        );
      } catch (err: any) {
        subscriber.error(err);
      }
    });
  }

  dispose(): void {
    this.subscription.forEach(subs => subs.unsubscribe());
  }
}

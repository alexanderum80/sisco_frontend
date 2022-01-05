import { CuentasNoPermitidasMutation } from '../models/cuentas-no-permitidas.model';
import { cuentasNoPermitidasApi } from '../graphql/cuentas-no-permitidas-api';
import { Apollo } from 'apollo-angular';
import { FormGroup, FormControl } from '@angular/forms';
import { Injectable } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { CuentasNoPermitidasQueryResponse } from '../models/cuentas-no-permitidas.model';

@Injectable()
export class CuentasNoPermitidasService {
  fg: FormGroup = new FormGroup({
    id: new FormControl(0),
    codigo: new FormControl(null),
    cta: new FormControl(''),
    subcta: new FormControl(''),
    crit1: new FormControl(''),
    crit2: new FormControl(''),
    crit3: new FormControl(''),
  });

  subscription: Subscription[] = [];

  constructor(
    private _apollo: Apollo,
  ) { }

  inicializarFg(): void {
    const payload = {
      id: 0,
      codigo: null,
      cta: '',
      subcta: '',
      crit1: '',
      crit2: '',
      crit3: '',
    };

    this.fg.patchValue(payload);
  }

  loadAllCuentasNoPermitidas(): Observable<CuentasNoPermitidasQueryResponse> {
    return new Observable<CuentasNoPermitidasQueryResponse>(subscriber => {
      try {
        this.subscription.push(this._apollo.watchQuery<CuentasNoPermitidasQueryResponse>({
          query: cuentasNoPermitidasApi.all,
          fetchPolicy: 'network-only'
        }).valueChanges.subscribe(response => {
          subscriber.next(response.data);
        }));
      } catch (err: any) {
        subscriber.error(err);
      }
    });
  }

  loadCuentaNoPermitida(id: number): Observable<CuentasNoPermitidasQueryResponse> {
    return new Observable<CuentasNoPermitidasQueryResponse>(subscriber => {
      try {
        this.subscription.push(this._apollo.watchQuery<CuentasNoPermitidasQueryResponse>({
          query: cuentasNoPermitidasApi.byId,
          variables: { id },
          fetchPolicy: 'network-only'
        }).valueChanges.subscribe(response => {
          subscriber.next(response.data);
          subscriber.complete();
        }));
      } catch (err: any) {
        subscriber.error(err);
      }
    });
  }

  saveCuentaNoPermitida(noUsarEnCuentaInput: any): Observable<CuentasNoPermitidasMutation> {
    return new Observable<CuentasNoPermitidasMutation>(subscriber => {
      try {
        this.subscription.push(this._apollo.mutate<CuentasNoPermitidasMutation>({
          mutation: cuentasNoPermitidasApi.save,
          variables: { noUsarEnCuentaInput },
          refetchQueries: ['GetAllNoUsarEnCuenta']
        }).subscribe(response => {
          subscriber.next(response.data || undefined);
        }));
      } catch (err: any) {
        subscriber.error(err);
      }
    });
  }

  deleteCuentaNoPermitida(id: number): Observable<CuentasNoPermitidasMutation> {
    return new Observable<CuentasNoPermitidasMutation>(subscriber => {
      try {
        this.subscription.push(this._apollo.mutate<CuentasNoPermitidasMutation>({
          mutation: cuentasNoPermitidasApi.delete,
          variables: { id },
          refetchQueries: ['GetAllNoUsarEnCuenta']
        }).subscribe(response => {
          subscriber.next(response.data || undefined);
        }));
      } catch (err: any) {
        subscriber.error(err);
      }
    });
  }
}

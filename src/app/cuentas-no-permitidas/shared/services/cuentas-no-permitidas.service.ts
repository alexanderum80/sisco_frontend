import { UsuarioService } from './../../../shared/services/usuario.service';
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
    centralizada: new FormControl(false),
    idDivision: new FormControl(0),
  });

  subscription: Subscription[] = [];

  constructor(private _apollo: Apollo, private _usuarioSvc: UsuarioService) {}

  inicializarFg(): void {
    const payload = {
      id: 0,
      codigo: null,
      cta: '',
      subcta: '',
      crit1: '',
      crit2: '',
      crit3: '',
      centralizada: false,
      idDivision: this._usuarioSvc.usuario.IdDivision,
    };

    this.fg.patchValue(payload);
  }

  loadAllCuentasNoPermitidas(): Observable<CuentasNoPermitidasQueryResponse> {
    return new Observable<CuentasNoPermitidasQueryResponse>(subscriber => {
      try {
        this.subscription.push(
          this._apollo
            .watchQuery<CuentasNoPermitidasQueryResponse>({
              query: cuentasNoPermitidasApi.all,
              fetchPolicy: 'network-only',
            })
            .valueChanges.subscribe(response => {
              subscriber.next(response.data);
            })
        );
      } catch (err: any) {
        subscriber.error(err);
      }
    });
  }

  loadCuentaNoPermitida(
    id: number
  ): Observable<CuentasNoPermitidasQueryResponse> {
    return new Observable<CuentasNoPermitidasQueryResponse>(subscriber => {
      try {
        this.subscription.push(
          this._apollo
            .watchQuery<CuentasNoPermitidasQueryResponse>({
              query: cuentasNoPermitidasApi.byId,
              variables: { id },
              fetchPolicy: 'network-only',
            })
            .valueChanges.subscribe(response => {
              subscriber.next(response.data);
              subscriber.complete();
            })
        );
      } catch (err: any) {
        subscriber.error(err);
      }
    });
  }

  saveCuentaNoPermitida(): Observable<CuentasNoPermitidasMutation> {
    return new Observable<CuentasNoPermitidasMutation>(subscriber => {
      try {
        const payload = {
          Id: this.fg.controls['id'].value,
          Codigo: this.fg.controls['codigo'].value,
          Cta: this.fg.controls['cta'].value,
          SubCta: this.fg.controls['subcta'].value,
          Crit1: this.fg.controls['crit1'].value,
          Crit2: this.fg.controls['crit2'].value,
          Crit3: this.fg.controls['crit3'].value,
          Centralizada: this.fg.controls['centralizada'].value,
          IdDivision: this.fg.controls['idDivision'].value,
        };

        const mutation =
          payload.Id === 0
            ? cuentasNoPermitidasApi.create
            : cuentasNoPermitidasApi.update;

        this.subscription.push(
          this._apollo
            .mutate<CuentasNoPermitidasMutation>({
              mutation: mutation,
              variables: { noUsarEnCuentaInput: payload },
              refetchQueries: ['GetAllNoUsarEnCuenta'],
            })
            .subscribe(response => {
              subscriber.next(response.data || undefined);
            })
        );
      } catch (err: any) {
        subscriber.error(err);
      }
    });
  }

  deleteCuentaNoPermitida(
    IDs: number[]
  ): Observable<CuentasNoPermitidasMutation> {
    return new Observable<CuentasNoPermitidasMutation>(subscriber => {
      try {
        this.subscription.push(
          this._apollo
            .mutate<CuentasNoPermitidasMutation>({
              mutation: cuentasNoPermitidasApi.delete,
              variables: { IDs },
              refetchQueries: ['GetAllNoUsarEnCuenta'],
            })
            .subscribe(response => {
              subscriber.next(response.data || undefined);
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

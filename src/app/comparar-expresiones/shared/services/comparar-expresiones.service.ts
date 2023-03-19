import { AuthenticationService } from './../../../shared/services/authentication.service';
import { compararExpresionesApi } from './../graphql/comparar-expresiones-api';
import { Apollo } from 'apollo-angular';
import {
  ComprobarExpresionesMutation,
  ComprobarExpresionesQueryResponse,
} from './../model/comparar-expresiones.model';
import { Observable, Subscription } from 'rxjs';
import { Injectable } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Injectable()
export class CompararExpresionesService {
  fg: FormGroup = new FormGroup({
    id: new FormControl(0),
    expresion: new FormControl(0),
    operador: new FormControl(''),
    expresionC: new FormControl(0),
    centro: new FormControl(false),
    complejo: new FormControl(false),
    consolidado: new FormControl(false),
    centralizada: new FormControl(false),
    idDivision: new FormControl(0),
  });

  subscription: Subscription[] = [];

  constructor(
    private _apollo: Apollo,
    private _authSvc: AuthenticationService
  ) {}

  inicializarFg(): void {
    const payload = {
      id: 0,
      expresion: null,
      operador: null,
      expresionC: null,
      centro: false,
      complejo: false,
      consolidado: false,
      centralizada: false,
      idDivision: this._authSvc.usuario.IdDivision,
    };

    this.fg.patchValue(payload);
  }

  loadAll(): Observable<ComprobarExpresionesQueryResponse> {
    return new Observable<ComprobarExpresionesQueryResponse>(subscriber => {
      try {
        this.subscription.push(
          this._apollo
            .watchQuery<ComprobarExpresionesQueryResponse>({
              query: compararExpresionesApi.all,
              fetchPolicy: 'network-only',
            })
            .valueChanges.subscribe(res => {
              subscriber.next(res.data);
            })
        );
      } catch (err: any) {
        subscriber.error(err.message || err);
      }
    });
  }

  loadOne(id: number): Observable<ComprobarExpresionesQueryResponse> {
    return new Observable<ComprobarExpresionesQueryResponse>(subscriber => {
      try {
        this.subscription.push(
          this._apollo
            .watchQuery<ComprobarExpresionesQueryResponse>({
              query: compararExpresionesApi.byId,
              variables: { id },
              fetchPolicy: 'network-only',
            })
            .valueChanges.subscribe(res => {
              subscriber.next(res.data);
              subscriber.complete();
            })
        );
      } catch (err: any) {
        subscriber.error(err.message || err);
      }
    });
  }

  save(): Observable<ComprobarExpresionesMutation> {
    return new Observable<ComprobarExpresionesMutation>(subscriber => {
      try {
        const payload = {
          Id: this.fg.controls['id'].value,
          IdExpresion: this.fg.controls['expresion'].value,
          IdOperador: this.fg.controls['operador'].value,
          IdExpresionC: this.fg.controls['expresionC'].value,
          Centro: this.fg.controls['centro'].value,
          Complejo: this.fg.controls['complejo'].value,
          Con: this.fg.controls['consolidado'].value,
          Centralizada: this.fg.controls['centralizada'].value,
          IdDivision: this.fg.controls['idDivision'].value,
        };

        const mutation =
          payload.Id === 0
            ? compararExpresionesApi.create
            : compararExpresionesApi.update;

        this.subscription.push(
          this._apollo
            .mutate<ComprobarExpresionesMutation>({
              mutation: mutation,
              variables: { comprobarExpresionInput: payload },
              refetchQueries: ['GetAllComprobarExpresiones'],
            })
            .subscribe(res => {
              subscriber.next(res.data || undefined);
            })
        );
      } catch (err: any) {
        subscriber.error(err.message || err);
      }
    });
  }

  delete(IDs: number[]): Observable<ComprobarExpresionesMutation> {
    return new Observable<ComprobarExpresionesMutation>(subscriber => {
      try {
        this.subscription.push(
          this._apollo
            .mutate<ComprobarExpresionesMutation>({
              mutation: compararExpresionesApi.delete,
              variables: { IDs },
              refetchQueries: ['GetAllComprobarExpresiones'],
            })
            .subscribe(res => {
              subscriber.next(res.data || undefined);
            })
        );
      } catch (err: any) {
        subscriber.error(err.message || err);
      }
    });
  }

  dispose() {
    this.subscription.forEach(subs => subs.unsubscribe());
  }
}

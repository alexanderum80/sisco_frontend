import { compararExpresionesApi } from './../graphql/comparar-expresiones-api';
import { Apollo } from 'apollo-angular';
import { ComprobarExpresionesMutation, ComprobarExpresionesQueryResponse } from './../model/comparar-expresiones.model';
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
  });

  subscription: Subscription[] = [];

  constructor(
    private _apollo: Apollo,
  ) { }

  inicializarFg(): void {
    const payload = {
      id: 0,
      expresion: null,
      operador: null,
      expresionC: null,
      centro: false,
      complejo: false,
      consolidado: false,
    };

    this.fg.patchValue(payload);
  }

  loadAllCompararExpresiones(): Observable<ComprobarExpresionesQueryResponse> {
    return new Observable<ComprobarExpresionesQueryResponse>(subscriber => {
      try {
        this.subscription.push(this._apollo.watchQuery<ComprobarExpresionesQueryResponse>({
          query: compararExpresionesApi.all,
          fetchPolicy: 'network-only'
        }).valueChanges.subscribe(response => {
          subscriber.next(response.data);
        }));
      } catch (err: any) {
        subscriber.error(err);
      }
    });
  }

  loadCompararExpresion(id: number): Observable<ComprobarExpresionesQueryResponse> {
    return new Observable<ComprobarExpresionesQueryResponse>(subscriber => {
      try {
        this.subscription.push(this._apollo.watchQuery<ComprobarExpresionesQueryResponse>({
          query: compararExpresionesApi.byId,
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

  saveCompararExpresion(comprobarExpresionInput: any): Observable<ComprobarExpresionesMutation> {
    return new Observable<ComprobarExpresionesMutation>(subscriber => {
      try {
        this.subscription.push(this._apollo.mutate<ComprobarExpresionesMutation>({
          mutation: compararExpresionesApi.save,
          variables: { comprobarExpresionInput },
          refetchQueries: ['GetAllComprobarExpresiones']
        }).subscribe(response => {
          subscriber.next(response.data || undefined);
        }));
      } catch (err: any) {
        subscriber.error(err);
      }
    });
  }

  deleteCompararExpresion(id: number): Observable<ComprobarExpresionesMutation> {
    return new Observable<ComprobarExpresionesMutation>(subscriber => {
      try {
        this.subscription.push(this._apollo.mutate<ComprobarExpresionesMutation>({
          mutation: compararExpresionesApi.delete,
          variables: { id },
          refetchQueries: ['GetAllComprobarExpresiones']
        }).subscribe(response => {
          subscriber.next(response.data || undefined);
        }));
      } catch (err: any) {
        subscriber.error(err);
      }
    });
  }
}

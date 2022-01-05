import { Injectable } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Apollo } from 'apollo-angular';
import { Observable, Subscription } from 'rxjs';
import { expresionesApi } from '../graphql/expresiones-api';
import { ExpresionesMutationResponse, ExpresionesQueryResponse } from '../models/expresiones.model';

@Injectable()
export class ExpresionesService {
  fg: FormGroup = new FormGroup({
    id: new FormControl(0),
    idExpresion: new FormControl(0),
    expresion: new FormControl(''),
    descripcion: new FormControl(''),
    acumulado: new FormControl(false),
    operacionesInternas: new FormControl(false),
  });

  subscription: Subscription[] = [];

  constructor(
    private _apollo: Apollo,
  ) { }

  inicializarFg(): void {
    this.fg.controls['id'].setValue(0);
    this.fg.controls['idExpresion'].setValue(0);
    this.fg.controls['expresion'].setValue('');
    this.fg.controls['descripcion'].setValue('');
    this.fg.controls['acumulado'].setValue(false);
    this.fg.controls['operacionesInternas'].setValue(false);
  }

  loadAllExpresionesResumen(): Observable<ExpresionesQueryResponse> {
    return new Observable<ExpresionesQueryResponse>(subscriber => {
      try {
        this.subscription.push(this._apollo.watchQuery<ExpresionesQueryResponse>({
          query: expresionesApi.allResumen,
          fetchPolicy: 'network-only'
        }).valueChanges.subscribe(response => {
          subscriber.next(response.data);
        }));
      } catch (err: any) {
        subscriber.error(err);
      }
    });
  }

  loadAllTipoValorExpresiones(): Observable<ExpresionesQueryResponse> {
    return new Observable<ExpresionesQueryResponse>(subscriber => {
      try {
        this.subscription.push(this._apollo.watchQuery<ExpresionesQueryResponse>({
          query: expresionesApi.tipoValor,
          fetchPolicy: 'network-only'
        }).valueChanges.subscribe(response => {
          subscriber.next(response.data);
        }));
      } catch (err: any) {
        subscriber.error(err);
      }
    });
  }

  loadExpresionResumenById(id: number): Observable<ExpresionesQueryResponse> {
    return new Observable<ExpresionesQueryResponse>(subscriber => {
      try {
        this.subscription.push(this._apollo.query<ExpresionesQueryResponse>({
          query: expresionesApi.resumenById,
          variables: { id },
          fetchPolicy: 'network-only'
        }).subscribe(response => {
          subscriber.next(response.data);
          subscriber.complete();
        }));
      } catch (err: any) {
        subscriber.error(err);
      }
    });
  }

  loadExpresionDetalleByIdResumen(idResumen: number): Observable<ExpresionesQueryResponse> {
    return new Observable<ExpresionesQueryResponse>(subscriber => {
      try {
        this.subscription.push(this._apollo.query<ExpresionesQueryResponse>({
          query: expresionesApi.detalleByIdResumen,
          variables: { idResumen },
          fetchPolicy: 'network-only'
        }).subscribe(response => {
          subscriber.next(response.data);
          subscriber.complete();
        }));
      } catch (err: any) {
        subscriber.error(err);
      }
    });
  }

  saveExpresion(payload: any): Observable<ExpresionesMutationResponse> {
    return new Observable<ExpresionesMutationResponse>(subscriber => {
      try {
        this.subscription.push(this._apollo.mutate<ExpresionesMutationResponse>({
          mutation: expresionesApi.save,
          variables: { expresionInput: payload },
          refetchQueries: ['GetAllExpresionesResumen']
        }).subscribe(response => {
          subscriber.next(response.data || undefined);
        }));
      } catch (err: any) {
        subscriber.error(err);
      }
    });
  }

  deleteExpresionResumen(id: number): Observable<ExpresionesMutationResponse> {
    return new Observable<ExpresionesMutationResponse>(subscriber => {
      try {
        this.subscription.push(this._apollo.mutate<ExpresionesMutationResponse>({
          mutation: expresionesApi.deleteResumen,
          variables: { id },
          refetchQueries: ['GetAllExpresionesResumen']
        }).subscribe(response => {
          subscriber.next(response.data || undefined);
        }));
      } catch (err: any) {
        subscriber.error(err);
      }
    });
  }

  unsubscribe(): void {
    this.subscription.forEach(subs => subs.unsubscribe());
  }
}

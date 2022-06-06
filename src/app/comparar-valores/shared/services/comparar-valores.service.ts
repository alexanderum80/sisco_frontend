import { ComprobarValoresMutation } from './../models/comparar-valores.model';
import { compararValoresApi } from './../graphql/comparar-valores-api';
import { Apollo } from 'apollo-angular';
import { Subscription, Observable } from 'rxjs';
import { FormGroup, FormControl } from '@angular/forms';
import { Injectable } from '@angular/core';
import { ComprobarValoresQueryResponse } from '../models/comparar-valores.model';

@Injectable()
export class CompararValoresService {
  fg: FormGroup = new FormGroup({
    id: new FormControl(0),
    centro: new FormControl(0),
    expresion: new FormControl(0),
    operador: new FormControl(''),
    valor: new FormControl(0),
    division: new FormControl(0),
  });

  subscription: Subscription[] = [];

  constructor(private _apollo: Apollo) {}

  inicializarFg(): void {
    const payload = {
      id: 0,
      centro: null,
      expresion: null,
      operador: null,
      valor: 0,
      division: 0,
    };

    this.fg.patchValue(payload);
  }

  loadAll(): Observable<ComprobarValoresQueryResponse> {
    return new Observable<ComprobarValoresQueryResponse>(subscriber => {
      try {
        this.subscription.push(
          this._apollo
            .watchQuery<ComprobarValoresQueryResponse>({
              query: compararValoresApi.all,
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

  loadOne(id: number): Observable<ComprobarValoresQueryResponse> {
    return new Observable<ComprobarValoresQueryResponse>(subscriber => {
      try {
        this.subscription.push(
          this._apollo
            .watchQuery<ComprobarValoresQueryResponse>({
              query: compararValoresApi.byId,
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

  save(): Observable<ComprobarValoresMutation> {
    return new Observable<ComprobarValoresMutation>(subscriber => {
      try {
        const payload = {
          Id: this.fg.controls['id'].value,
          IdCentro: this.fg.controls['centro'].value,
          IdExpresion: this.fg.controls['expresion'].value,
          IdOperador: this.fg.controls['operador'].value,
          Valor: this.fg.controls['valor'].value,
          IdDivision: this.fg.controls['division'].value,
        };

        const mutation =
          payload.Id === 0
            ? compararValoresApi.create
            : compararValoresApi.update;

        this.subscription.push(
          this._apollo
            .mutate<ComprobarValoresMutation>({
              mutation: mutation,
              variables: { comprobarValorInput: payload },
              refetchQueries: ['GetAllComprobarValores'],
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

  delete(IDs: number[]): Observable<ComprobarValoresMutation> {
    return new Observable<ComprobarValoresMutation>(subscriber => {
      try {
        this.subscription.push(
          this._apollo
            .mutate<ComprobarValoresMutation>({
              mutation: compararValoresApi.delete,
              variables: { IDs },
              refetchQueries: ['GetAllComprobarValores'],
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

  dispose() {
    this.subscription.forEach(subs => subs.unsubscribe());
  }
}

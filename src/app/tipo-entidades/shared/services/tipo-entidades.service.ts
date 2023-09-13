import { AuthenticationService } from './../../../shared/services/authentication.service';
import {
  TipoEntidadesMutationResponse,
  TipoEntidadesQueryResponse,
} from './../models/tipo-entidades.model';
import { tipoEntidadesApi } from './../graphql/tipo-entidades.actions';
import { Apollo } from 'apollo-angular';
import { FormGroup, FormControl } from '@angular/forms';
import { Injectable } from '@angular/core';
import { Subscription, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TipoEntidadesService {
  fg: FormGroup = new FormGroup({
    id: new FormControl(''),
    entidades: new FormControl(''),
    descripcion: new FormControl(''),
  });

  subscription: Subscription[] = [];

  constructor(
    private _apollo: Apollo,
    private _authSvc: AuthenticationService
  ) {}

  hasAdvancedUserPermission(): boolean {
    return this._authSvc.hasAdvancedUserPermission();
  }

  loadAllTipoEntidades(): Observable<TipoEntidadesQueryResponse> {
    return new Observable<TipoEntidadesQueryResponse>(subscriber => {
      try {
        this.subscription.push(
          this._apollo
            .watchQuery<TipoEntidadesQueryResponse>({
              query: tipoEntidadesApi.all,
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

  loadTipoEntidadById(id: string): Observable<TipoEntidadesQueryResponse> {
    return new Observable(subscriber => {
      try {
        this.subscription.push(
          this._apollo
            .watchQuery<TipoEntidadesQueryResponse>({
              query: tipoEntidadesApi.byId,
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

  save(): Observable<TipoEntidadesMutationResponse> {
    return new Observable<TipoEntidadesMutationResponse>(subscriber => {
      try {
        const tipoEntidadInfo = {
          Id: Number(this.fg.controls['id'].value),
          Entidades: this.fg.controls['entidades'].value,
          Descripcion: this.fg.controls['descripcion'].value,
        };

        const mutation =
          tipoEntidadInfo.Id === 0
            ? tipoEntidadesApi.create
            : tipoEntidadesApi.update;

        this.subscription.push(
          this._apollo
            .mutate<TipoEntidadesMutationResponse>({
              mutation: mutation,
              variables: { tipoEntidadInfo },
              refetchQueries: ['GetAllTipoEntidades'],
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

  delete(IDs: number[]): Observable<TipoEntidadesMutationResponse> {
    return new Observable<TipoEntidadesMutationResponse>(subscriber => {
      try {
        this.subscription.push(
          this._apollo
            .mutate<TipoEntidadesMutationResponse>({
              mutation: tipoEntidadesApi.delete,
              variables: { IDs },
              refetchQueries: ['GetAllTipoEntidades'],
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

  dispose(): void {
    this.subscription.forEach(subs => subs.unsubscribe());
  }
}

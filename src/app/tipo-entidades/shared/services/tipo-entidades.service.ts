import { TipoEntidadesMutationResponse, TipoEntidadesQueryResponse } from './../models/tipo-entidades.model';
import { tipoEntidadesApi } from './../graphql/tipo-entidades.actions';
import { UsuarioService } from './../../../shared/services/usuario.service';
import { Apollo } from 'apollo-angular';
import { FormGroup, FormControl } from '@angular/forms';
import { Injectable } from '@angular/core';
import { Subscription, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
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
    private _usuarioSvc: UsuarioService,
  ) { }

  hasAdvancedUserPermission(): boolean {
    return this._usuarioSvc.hasAdvancedUserPermission();
  }

  loadAllTipoEntidades(): Observable<TipoEntidadesQueryResponse> {
    return new Observable<TipoEntidadesQueryResponse>(subscriber => {
      try {
        this.subscription.push(this._apollo.watchQuery<TipoEntidadesQueryResponse>({
          query: tipoEntidadesApi.all,
          fetchPolicy: 'network-only'
        }).valueChanges.subscribe(res => {
          subscriber.next(res.data);
        }));
      } catch (err: any) {
        subscriber.error(err);
      }
    });
  }

  loadTipoEntidadById(id: string): Observable<TipoEntidadesQueryResponse> {
    return new Observable(subscriber => {
      try {
        this.subscription.push(this._apollo.watchQuery<TipoEntidadesQueryResponse>({
          query: tipoEntidadesApi.byId,
          variables: { id },
          fetchPolicy: 'network-only'
        }).valueChanges.subscribe(res => {
          subscriber.next(res.data);
          subscriber.complete();
        }));
      } catch (err: any) {
        subscriber.error(err);
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

        this.subscription.push(this._apollo.mutate<TipoEntidadesMutationResponse>({
          mutation: tipoEntidadesApi.save,
          variables: { tipoEntidadInfo },
          refetchQueries: ['GetAllTipoEntidades']
        }).subscribe(response => {
          subscriber.next(response.data || undefined);
        }));
      } catch (err: any) {
        subscriber.error(err);
      }
    });
  }

  delete(id: number): Observable<TipoEntidadesMutationResponse> {
    return new Observable<TipoEntidadesMutationResponse>(subscriber => {
      try {
        this.subscription.push(this._apollo.mutate<TipoEntidadesMutationResponse>({
          mutation: tipoEntidadesApi.delete,
          variables: { id },
          refetchQueries: ['GetAllTipoEntidades']
        }).subscribe(response => {
          subscriber.next(response.data || undefined);
        }));
      } catch (err: any) {
        subscriber.error(err);
      }
    });
  }

  dispose(): void {
    this.subscription.forEach(subs => subs.unsubscribe());
  }
}

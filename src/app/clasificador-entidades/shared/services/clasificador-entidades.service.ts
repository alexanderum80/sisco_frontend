import { ActionClicked } from './../../../shared/models/list-items';
import {
    ClasificadorEntidadesQueryResponse,
    ClasificadorEntidadesMutationResponse,
} from './../models/clasificador-entidades.model';
import { UsuarioService } from 'src/app/shared/services/usuario.service';
import { Apollo } from 'apollo-angular';
import { Observable, Subscription } from 'rxjs';
import { FormGroup, FormControl } from '@angular/forms';
import { Injectable } from '@angular/core';
import { clasificadorEntidadesApi } from '../graphql/clasificador-entidades.actions';

@Injectable({
    providedIn: 'root',
})
export class ClasificadorEntidadesService {
    fg: FormGroup = new FormGroup({
        idUnidad: new FormControl(''),
        idTipoEntidad: new FormControl(''),
    });

    subscription: Subscription[] = [];

    constructor(private _apollo: Apollo, private _usuarioSvc: UsuarioService) {}

    hasAdvancedUserPermission(): boolean {
        return this._usuarioSvc.hasAdvancedUserPermission();
    }

    loadAllClasificadorEntidades(): Observable<ClasificadorEntidadesQueryResponse> {
        return new Observable<ClasificadorEntidadesQueryResponse>(
            subscriber => {
                try {
                    this.subscription.push(
                        this._apollo
                            .watchQuery<ClasificadorEntidadesQueryResponse>({
                                query: clasificadorEntidadesApi.all,
                                fetchPolicy: 'network-only',
                            })
                            .valueChanges.subscribe({
                                next: res => subscriber.next(res.data),
                                error: err => subscriber.error(err),
                            })
                    );
                } catch (err: any) {
                    subscriber.error(err);
                }
            }
        );
    }

    loadClasificadorEntidad(
        idUnidad: number
    ): Observable<ClasificadorEntidadesQueryResponse> {
        return new Observable(subscriber => {
            try {
                this.subscription.push(
                    this._apollo
                        .watchQuery<ClasificadorEntidadesQueryResponse>({
                            query: clasificadorEntidadesApi.by,
                            variables: { idUnidad },
                            fetchPolicy: 'network-only',
                        })
                        .valueChanges.subscribe({
                            next: res => {
                                subscriber.next(res.data);
                                subscriber.complete();
                            },
                            error: err => {
                                subscriber.error(err);
                            },
                        })
                );
            } catch (err: any) {
                subscriber.error(err);
            }
        });
    }

    save(
        action: ActionClicked
    ): Observable<ClasificadorEntidadesMutationResponse> {
        return new Observable<ClasificadorEntidadesMutationResponse>(
            subscriber => {
                try {
                    const clasificadorEntidadInfo = {
                        IdUnidad: Number(this.fg.controls['idUnidad'].value),
                        IdTipoEntidad: this.fg.controls['idTipoEntidad'].value,
                    };

                    const mutation =
                        action === ActionClicked.Add
                            ? clasificadorEntidadesApi.create
                            : clasificadorEntidadesApi.update;

                    this.subscription.push(
                        this._apollo
                            .mutate<ClasificadorEntidadesMutationResponse>({
                                mutation: mutation,
                                variables: { clasificadorEntidadInfo },
                                refetchQueries: ['GetAllClasificadorEntidades'],
                            })
                            .subscribe({
                                next: response => {
                                    subscriber.next(response.data || undefined);
                                },
                                error: err => {
                                    subscriber.error(err);
                                },
                            })
                    );
                } catch (err: any) {
                    subscriber.error(err);
                }
            }
        );
    }

    delete(IDs: number[]): Observable<ClasificadorEntidadesMutationResponse> {
        return new Observable<ClasificadorEntidadesMutationResponse>(
            subscriber => {
                try {
                    this.subscription.push(
                        this._apollo
                            .mutate<ClasificadorEntidadesMutationResponse>({
                                mutation: clasificadorEntidadesApi.delete,
                                variables: { IDs },
                                refetchQueries: ['GetAllClasificadorEntidades'],
                            })
                            .subscribe({
                                next: response => {
                                    subscriber.next(response.data || undefined);
                                },
                                error: err => {
                                    subscriber.error(err);
                                },
                            })
                    );
                } catch (err: any) {
                    subscriber.error(err);
                }
            }
        );
    }

    dispose(): void {
        this.subscription.forEach(subs => subs.unsubscribe());
    }
}

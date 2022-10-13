import { elementosGastosApi } from './../graphql/elementos-gastos.actions';
import {
    ElementosGastosQueryResponse,
    ElementosGastosMutationResponse,
} from './../models/elementos-gastos.model';
import { UsuarioService } from 'src/app/shared/services/usuario.service';
import { Apollo } from 'apollo-angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Injectable } from '@angular/core';
import { Subscription, Observable } from 'rxjs';

@Injectable()
export class ElementosGastosService {
    fg: FormGroup = new FormGroup({
        elemento: new FormControl('', Validators.maxLength(5)),
        descripcion: new FormControl(''),
        usoContenido: new FormControl(''),
        tipoEntidad: new FormControl(''),
        cuentaAsociada: new FormControl(''),
        epigrafe: new FormControl(''),
    });

    subscription: Subscription[] = [];

    constructor(private _apollo: Apollo, private _usuarioSvc: UsuarioService) {}

    hasAdvancedUserPermission(): boolean {
        return this._usuarioSvc.hasAdvancedUserPermission();
    }

    loadAllElementosGastos(): Observable<ElementosGastosQueryResponse> {
        return new Observable<ElementosGastosQueryResponse>(subscriber => {
            try {
                this.subscription.push(
                    this._apollo
                        .watchQuery<ElementosGastosQueryResponse>({
                            query: elementosGastosApi.all,
                            fetchPolicy: 'network-only',
                        })
                        .valueChanges.subscribe({
                            next: res => subscriber.next(res.data || undefined),
                            error: err => subscriber.error(err),
                        })
                );
            } catch (err: any) {
                subscriber.error(err);
            }
        });
    }

    loadElementoGastoById(
        id: string
    ): Observable<ElementosGastosQueryResponse> {
        return new Observable(subscriber => {
            try {
                this._apollo
                    .query<ElementosGastosQueryResponse>({
                        query: elementosGastosApi.byId,
                        variables: { id },
                        fetchPolicy: 'network-only',
                    })
                    .subscribe({
                        next: response => {
                            subscriber.next(response.data || undefined);
                            subscriber.complete();
                        },
                        error: err => subscriber.error(err),
                    });
            } catch (err: any) {
                subscriber.error(err);
            }
        });
    }

    save(): Observable<ElementosGastosMutationResponse> {
        return new Observable<ElementosGastosMutationResponse>(subscriber => {
            try {
                const elementoGastoInfo = {
                    Egasto: this.fg.controls['elemento'].value,
                    Descripcion: this.fg.controls['descripcion'].value,
                    UsoContenido: this.fg.controls['usoContenido'].value,
                    TipoEntidad:
                        this.fg.controls['tipoEntidad'].value.join(', '),
                    CuentaAsociada:
                        this.fg.controls['cuentaAsociada'].value.join(', '),
                    IdEpigrafe: this.fg.controls['epigrafe'].value,
                };

                this.subscription.push(
                    this._apollo
                        .mutate<ElementosGastosMutationResponse>({
                            mutation: elementosGastosApi.save,
                            variables: { elementoGastoInfo },
                            refetchQueries: ['GetAllElementosGastos'],
                        })
                        .subscribe({
                            next: res => subscriber.next(res.data || undefined),
                            error: err => subscriber.error(err),
                        })
                );
            } catch (err: any) {
                subscriber.error(err);
            }
        });
    }

    delete(IDs: number[]): Observable<ElementosGastosMutationResponse> {
        return new Observable<ElementosGastosMutationResponse>(subscriber => {
            try {
                this.subscription.push(
                    this._apollo
                        .mutate<ElementosGastosMutationResponse>({
                            mutation: elementosGastosApi.delete,
                            variables: { IDs },
                            refetchQueries: ['GetAllElementosGastos'],
                        })
                        .subscribe({
                            next: res => subscriber.next(res.data || undefined),
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

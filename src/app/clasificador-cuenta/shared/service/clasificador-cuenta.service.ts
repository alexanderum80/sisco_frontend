import { FormGroup, FormControl } from '@angular/forms';
import {
    ClasificadorCuentasQueryResponse,
    ClasificadorCuentasMutationResponse,
} from './../models/clasificador-cuenta.model';
import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable, Subscription } from 'rxjs';
import SweetAlert from 'sweetalert2';
import { clasificadorCuentaApi } from '../graphql/clasificador-cuenta.actions';

@Injectable()
export class ClasificadorCuentaService {
    fg: FormGroup = new FormGroup({
        cuenta: new FormControl(''),
        subcuenta: new FormControl(''),
        descripcion: new FormControl(''),
        naturaleza: new FormControl(''),
        crit1: new FormControl(''),
        crit2: new FormControl(''),
        crit3: new FormControl(''),
        obligacion: new FormControl(false),
        tipoClasificador: new FormControl(''),
        seUtiliza: new FormControl(''),
        terminal: new FormControl(false),
        crit1Consolidacion: new FormControl(''),
        crit2Consolidacion: new FormControl(''),
        crit3Consolidacion: new FormControl(''),
    });

    subscription: Subscription[] = [];

    constructor(private _apollo: Apollo) {}

    loadAllClasificadorCuenta(): Observable<ClasificadorCuentasQueryResponse> {
        return new Observable(subscriber => {
            this.subscription.push(
                this._apollo
                    .watchQuery<ClasificadorCuentasQueryResponse>({
                        query: clasificadorCuentaApi.all,
                        fetchPolicy: 'network-only',
                    })
                    .valueChanges.subscribe({
                        next: response => subscriber.next(response.data),
                        error: err => subscriber.error(err),
                    })
            );
        });
    }

    loadClasificadorCuenta(
        cuenta: string,
        subcuenta: string,
        tipo: string
    ): Observable<ClasificadorCuentasQueryResponse> {
        return new Observable(subscriber => {
            try {
                const payload = {
                    cuenta,
                    subcuenta,
                    tipo,
                };

                this.subscription.push(
                    this._apollo
                        .watchQuery<ClasificadorCuentasQueryResponse>({
                            query: clasificadorCuentaApi.byTipo,
                            variables: payload,
                            fetchPolicy: 'network-only',
                        })
                        .valueChanges.subscribe(res => {
                            subscriber.next(res.data);
                            subscriber.complete();
                        })
                );
            } catch (err: any) {
                subscriber.error(err);
            }
        });
    }

    loadCuentasAgrupadas(): Observable<ClasificadorCuentasQueryResponse> {
        return new Observable<ClasificadorCuentasQueryResponse>(subscriber => {
            this.subscription.push(
                this._apollo
                    .watchQuery<ClasificadorCuentasQueryResponse>({
                        query: clasificadorCuentaApi.cuenta,
                        fetchPolicy: 'network-only',
                    })
                    .valueChanges.subscribe(response => {
                        subscriber.next(response.data);
                        subscriber.complete();
                    })
            );
        });
    }

    save(): Observable<ClasificadorCuentasMutationResponse> {
        return new Observable<ClasificadorCuentasMutationResponse>(
            subscriber => {
                try {
                    const clasificadorInfo = {
                        Cuenta: this.fg.controls['cuenta'].value,
                        SubCuenta: this.fg.controls['subcuenta'].value,
                        Descripcion: this.fg.controls['descripcion'].value,
                        Naturaleza: this.fg.controls['naturaleza'].value,
                        Crit1: this.fg.controls['crit1'].value,
                        Crit2: this.fg.controls['crit2'].value,
                        Crit3: this.fg.controls['crit3'].value,
                        Obligacion: this.fg.controls['obligacion'].value,
                        TipoClasificador:
                            this.fg.controls['tipoClasificador'].value,
                        SeUtiliza:
                            this.fg.controls['seUtiliza'].value.join(', '),
                        Terminal: this.fg.controls['terminal'].value,
                        Crit1Consolidacion:
                            this.fg.controls['crit1Consolidacion'].value,
                        Crit2Consolidacion:
                            this.fg.controls['crit2Consolidacion'].value,
                        Crit3Consolidacion:
                            this.fg.controls['crit3Consolidacion'].value,
                    };

                    this.subscription.push(
                        this._apollo
                            .mutate<ClasificadorCuentasMutationResponse>({
                                mutation: clasificadorCuentaApi.save,
                                variables: { clasificadorInfo },
                                refetchQueries: ['GetAllClasificadorCuentas'],
                            })
                            .subscribe(response => {
                                subscriber.next(response.data || undefined);
                            })
                    );
                } catch (err: any) {
                    subscriber.error(err);
                }
            }
        );
    }

    delete(clasificador: any): Observable<ClasificadorCuentasMutationResponse> {
        return new Observable<ClasificadorCuentasMutationResponse>(
            subscriber => {
                try {
                    const payload = {
                        cuenta: clasificador.Cuenta,
                        subcuenta: clasificador.SubCuenta,
                        tipo: clasificador.TipoClasificador,
                    };

                    this.subscription.push(
                        this._apollo
                            .mutate<ClasificadorCuentasMutationResponse>({
                                mutation: clasificadorCuentaApi.delete,
                                variables: payload,
                                refetchQueries: ['GetAllClasificadorCuentas'],
                            })
                            .subscribe(response => {
                                subscriber.next(response.data || undefined);
                            })
                    );
                } catch (err: any) {
                    SweetAlert.fire({
                        icon: 'error',
                        title: 'ERROR',
                        text: err,
                        showConfirmButton: true,
                        confirmButtonText: 'Aceptar',
                    });
                }
            }
        );
    }

    dispose(): void {
        this.subscription.forEach(subs => subs.unsubscribe());
    }
}

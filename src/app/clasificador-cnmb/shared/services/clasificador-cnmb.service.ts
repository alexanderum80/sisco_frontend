import {
    ClasificadorCNMBQueryResponse,
    ClasificadorCNMBMutationResponse,
} from './../models/clasificador-cnmb.model';
import { clasificadorCnmbApi } from './../graphql/clasificador-cnmb.actions';
import { ApolloService } from './../../../shared/services/apollo.service';
import { Subscription, Observable } from 'rxjs';
import { FormGroup, FormControl } from '@angular/forms';
import { Injectable } from '@angular/core';

@Injectable()
export class ClasificadorCnmbService {
    fg: FormGroup = new FormGroup({
        cnmb: new FormControl(''),
        descripcion: new FormControl(''),
        tasa: new FormControl(0),
    });

    subscription: Subscription[] = [];

    constructor(private _apolloSvc: ApolloService) {}

    loadAll(): Observable<ClasificadorCNMBQueryResponse> {
        return new Observable(subscriber => {
            this.subscription.push(
                this._apolloSvc
                    .watchQuery<ClasificadorCNMBQueryResponse>(
                        clasificadorCnmbApi.all
                    )
                    .subscribe({
                        next: result => {
                            subscriber.next(result);
                        },
                        error: err => {
                            subscriber.error(err.message || err);
                        },
                    })
            );
        });
    }

    loadOne(cnmb: number): Observable<ClasificadorCNMBQueryResponse> {
        return new Observable(subscriber => {
            try {
                this.subscription.push(
                    this._apolloSvc
                        .query<ClasificadorCNMBQueryResponse>(
                            clasificadorCnmbApi.byId,
                            {
                                cnmb,
                            }
                        )
                        .subscribe({
                            next: res => {
                                subscriber.next(res);
                                subscriber.complete();
                            },
                            error: err => {
                                subscriber.error(err.message || err);
                            },
                        })
                );
            } catch (err: any) {
                subscriber.error(err);
            }
        });
    }

    save(): Observable<ClasificadorCNMBMutationResponse> {
        return new Observable<ClasificadorCNMBMutationResponse>(subscriber => {
            try {
                const actfijosClasificadorCnmbInput = {
                    CNMB: this.fg.controls['cnmb'].value,
                    DCNMB: this.fg.controls['descripcion'].value,
                    TREPO: this.fg.controls['tasa'].value,
                };

                this.subscription.push(
                    this._apolloSvc
                        .mutation<ClasificadorCNMBMutationResponse>(
                            clasificadorCnmbApi.save,
                            { actfijosClasificadorCnmbInput },
                            ['GetAllActFijosClasificadorCnmb']
                        )
                        .subscribe({
                            next: res => {
                                subscriber.next(res);
                                subscriber.complete();
                            },
                            error: err => {
                                subscriber.error(err.message || err);
                            },
                        })
                );
            } catch (err: any) {
                subscriber.error(err);
            }
        });
    }

    delete(cnmb: number): Observable<ClasificadorCNMBMutationResponse> {
        return new Observable<ClasificadorCNMBMutationResponse>(subscriber => {
            try {
                this.subscription.push(
                    this._apolloSvc
                        .mutation<ClasificadorCNMBMutationResponse>(
                            clasificadorCnmbApi.delete,
                            { cnmb },
                            ['GetAllActFijosClasificadorCnmb']
                        )
                        .subscribe({
                            next: res => {
                                subscriber.next(res);
                                subscriber.complete();
                            },
                            error: err => {
                                subscriber.error(err.message || err);
                            },
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

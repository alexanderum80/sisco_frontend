import { clasificadorSubgruposApi } from './../graphql/clasificador-subgrupos.actions';
import {
  ClasificadorSubgruposQueryResponse,
  ClasificadorSubgruposMutationResponse,
  IActFijosClasificadorSubgrupos,
} from './../models/clasificador-subgrupos.model';
import { ApolloService } from '../../../shared/helpers/apollo.service';
import { Injectable } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';

@Injectable()
export class ClasificadorSubgruposService {
  fg: FormGroup = new FormGroup({
    grupo: new FormControl(''),
    codigo: new FormControl(''),
    descripcion: new FormControl(''),
    tasa: new FormControl(0),
  });

  subscription: Subscription[] = [];

  constructor(private _apolloSvc: ApolloService) {}

  loadAll(): Observable<ClasificadorSubgruposQueryResponse> {
    return new Observable(subscriber => {
      this.subscription.push(
        this._apolloSvc
          .watchQuery<ClasificadorSubgruposQueryResponse>(
            clasificadorSubgruposApi.all
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

  loadOne(
    grupo: number,
    codigo: number
  ): Observable<ClasificadorSubgruposQueryResponse> {
    return new Observable(subscriber => {
      try {
        this.subscription.push(
          this._apolloSvc
            .query<ClasificadorSubgruposQueryResponse>(
              clasificadorSubgruposApi.byId,
              {
                grupo,
                codigo,
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
        subscriber.error(err.message || err);
      }
    });
  }

  save(): Observable<ClasificadorSubgruposMutationResponse> {
    return new Observable<ClasificadorSubgruposMutationResponse>(subscriber => {
      try {
        const actFijosClasificadorSubgrupoInput: IActFijosClasificadorSubgrupos =
          {
            Grupo: this.fg.controls['grupo'].value,
            Codigo: this.fg.controls['codigo'].value,
            Descripcion: this.fg.controls['descripcion'].value,
            Tasa: this.fg.controls['tasa'].value,
          };

        this.subscription.push(
          this._apolloSvc
            .mutation<ClasificadorSubgruposMutationResponse>(
              clasificadorSubgruposApi.save,
              {
                actFijosClasificadorSubgrupoInput,
              },
              ['GetAllActFijosClasificadorSubgrupo']
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
        subscriber.error(err.message || err);
      }
    });
  }

  delete(
    grupo: number,
    codigo: number
  ): Observable<ClasificadorSubgruposMutationResponse> {
    return new Observable<ClasificadorSubgruposMutationResponse>(subscriber => {
      try {
        this.subscription.push(
          this._apolloSvc
            .mutation<ClasificadorSubgruposMutationResponse>(
              clasificadorSubgruposApi.delete,
              { grupo, codigo },
              ['GetAllActFijosClasificadorSubgrupo']
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
        subscriber.error(err.message || err);
      }
    });
  }

  dispose(): void {
    this.subscription.forEach(subs => subs.unsubscribe());
  }
}

import { ApolloService } from './../../../shared/services/apollo.service';
import { FormGroup, FormControl } from '@angular/forms';
import {
  ClasificadorCuentasQueryResponse,
  ClasificadorCuentasMutationResponse,
} from './../models/clasificador-cuenta.model';
import { Injectable } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import SweetAlert from 'sweetalert2';
import { clasificadorCuentaApi } from '../graphql/clasificador-cuenta.actions';
import * as moment from 'moment';

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

  fgArreglaClasif: FormGroup = new FormGroup({
    tipoCentro: new FormControl('0', { initialValueIsDefault: true }),
    idCentro: new FormControl(null, { initialValueIsDefault: true }),
    annio: new FormControl(moment().year().toString(), {
      initialValueIsDefault: true,
    }),
  });

  subscription: Subscription[] = [];

  constructor(private _apolloSvc: ApolloService) {}

  loadAllClasificadorCuenta(
    tipo: number
  ): Observable<ClasificadorCuentasQueryResponse> {
    return new Observable(subscriber => {
      this.subscription.push(
        this._apolloSvc
          .watchQuery<ClasificadorCuentasQueryResponse>(
            clasificadorCuentaApi.all,
            { tipo }
          )
          .subscribe({
            next: res => subscriber.next(res),
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
          this._apolloSvc
            .watchQuery<ClasificadorCuentasQueryResponse>(
              clasificadorCuentaApi.byTipo,
              payload
            )
            .subscribe(res => {
              subscriber.next(res);
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
        this._apolloSvc
          .watchQuery<ClasificadorCuentasQueryResponse>(
            clasificadorCuentaApi.cuenta
          )
          .subscribe(res => {
            subscriber.next(res);
            subscriber.complete();
          })
      );
    });
  }

  save(): Observable<ClasificadorCuentasMutationResponse> {
    return new Observable<ClasificadorCuentasMutationResponse>(subscriber => {
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
          TipoClasificador: this.fg.controls['tipoClasificador'].value,
          SeUtiliza: this.fg.controls['seUtiliza'].value.join(', '),
          Terminal: this.fg.controls['terminal'].value,
          Crit1Consolidacion: this.fg.controls['crit1Consolidacion'].value,
          Crit2Consolidacion: this.fg.controls['crit2Consolidacion'].value,
          Crit3Consolidacion: this.fg.controls['crit3Consolidacion'].value,
        };

        this.subscription.push(
          this._apolloSvc
            .mutation<ClasificadorCuentasMutationResponse>(
              clasificadorCuentaApi.save,
              { clasificadorInfo },
              ['GetAllClasificadorCuentas']
            )
            .subscribe(res => {
              subscriber.next(res || undefined);
            })
        );
      } catch (err: any) {
        subscriber.error(err);
      }
    });
  }

  delete(clasificador: any): Observable<ClasificadorCuentasMutationResponse> {
    return new Observable<ClasificadorCuentasMutationResponse>(subscriber => {
      try {
        const payload = {
          cuenta: clasificador.Cuenta,
          subcuenta: clasificador.SubCuenta,
          tipo: clasificador.TipoClasificador,
        };

        this.subscription.push(
          this._apolloSvc
            .mutation<ClasificadorCuentasMutationResponse>(
              clasificadorCuentaApi.delete,
              payload,
              ['GetAllClasificadorCuentas']
            )
            .subscribe(res => {
              subscriber.next(res || undefined);
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
    });
  }

  dispose(): void {
    this.subscription.forEach(subs => subs.unsubscribe());
  }

  arreglaClasificador(): Observable<ClasificadorCuentasMutationResponse> {
    return new Observable<ClasificadorCuentasMutationResponse>(subscriber => {
      try {
        const payload = {
          idUnidad: +this.fgArreglaClasif.controls['idCentro'].value,
          tipoUnidad: this.fgArreglaClasif.controls['tipoCentro'].value,
          annio: this.fgArreglaClasif.controls['annio'].value,
        };

        this.subscription.push(
          this._apolloSvc
            .mutation<ClasificadorCuentasMutationResponse>(
              clasificadorCuentaApi.arregla,
              payload
            )
            .subscribe({
              next: res => {
                subscriber.next(res);
              },
              error: err => {
                subscriber.error(err);
              },
            })
        );
      } catch (err: any) {
        throw new Error(err);
      }
    });
  }
}

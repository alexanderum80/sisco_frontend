import { ApolloService } from '../../../shared/helpers/apollo.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {
  ClasificadorCuentasQueryResponse,
  ClasificadorCuentasMutationResponse,
  IGrupoCuenta,
  IClaseCuenta,
  ICategoriaCuenta,
} from './../models/clasificador-cuenta.model';
import { Injectable } from '@angular/core';
import { Observable, Subscription, BehaviorSubject } from 'rxjs';
import SweetAlert from 'sweetalert2';
import { clasificadorCuentaApi } from '../graphql/clasificador-cuenta.actions';
import * as moment from 'moment';

@Injectable()
export class ClasificadorCuentaService {
  fg: FormGroup = new FormGroup({
    tipoClasificador: new FormControl('', { initialValueIsDefault: true }),
    cuenta: new FormControl('', { initialValueIsDefault: true }),
    subcuenta: new FormControl('', { initialValueIsDefault: true }),
    nombre: new FormControl('', { initialValueIsDefault: true }),
    naturaleza: new FormControl('', { initialValueIsDefault: true }),
    crit1: new FormControl('', { initialValueIsDefault: true }),
    crit2: new FormControl('', { initialValueIsDefault: true }),
    crit3: new FormControl('', { initialValueIsDefault: true }),
    crit4: new FormControl('', { initialValueIsDefault: true }),
    crit5: new FormControl('', { initialValueIsDefault: true }),
    obligacion: new FormControl(false, { initialValueIsDefault: true }),
    grupo: new FormControl(null, { initialValueIsDefault: true }),
    clase: new FormControl(null, { initialValueIsDefault: true }),
    categoria: new FormControl(null, { initialValueIsDefault: true }),
    clasificacion: new FormControl(null, { initialValueIsDefault: true }),
    tipo: new FormControl(null, { initialValueIsDefault: true }),
    estado: new FormControl('A', { initialValueIsDefault: true }),
    terminal: new FormControl(false, { initialValueIsDefault: true }),
    crit1Consolidacion: new FormControl('', { initialValueIsDefault: true }),
    crit2Consolidacion: new FormControl('', { initialValueIsDefault: true }),
    crit3Consolidacion: new FormControl('', { initialValueIsDefault: true }),
    crit4Consolidacion: new FormControl('', { initialValueIsDefault: true }),
    crit5Consolidacion: new FormControl('', { initialValueIsDefault: true }),
    seUtiliza: new FormControl('', { initialValueIsDefault: true }),
  });

  fgArreglaClasif: FormGroup = new FormGroup({
    tipoCentro: new FormControl('0', { initialValueIsDefault: true }),
    idCentro: new FormControl(null, { initialValueIsDefault: true }),
    annio: new FormControl(moment().year().toString(), {
      initialValueIsDefault: true,
      validators: [Validators.minLength(4), Validators.maxLength(4)],
    }),
  });

  subscription: Subscription[] = [];

  grupoCuentas$ = new BehaviorSubject<IGrupoCuenta[]>([]);
  claseCuentas$ = new BehaviorSubject<IClaseCuenta[]>([]);
  categoriaCuentas$ = new BehaviorSubject<ICategoriaCuenta[]>([]);

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
            error: err => subscriber.error(err.message || err),
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
        subscriber.error(err.message || err);
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
          TipoClasificador: this.fg.controls['tipoClasificador'].value,
          Cuenta: this.fg.controls['cuenta'].value,
          SubCuenta: this.fg.controls['subcuenta'].value,
          Nombre: this.fg.controls['nombre'].value,
          Naturaleza: this.fg.controls['naturaleza'].value,
          Tipo_Analisis_1: this.fg.controls['crit1'].value,
          Tipo_Analisis_2: this.fg.controls['crit2'].value,
          Tipo_Analisis_3: this.fg.controls['crit3'].value,
          Tipo_Analisis_4: this.fg.controls['crit4'].value,
          Tipo_Analisis_5: this.fg.controls['crit5'].value,
          Obligacion: this.fg.controls['obligacion'].value,
          Grupo: this.fg.controls['grupo'].value,
          Clase: this.fg.controls['clase'].value,
          Categoria: this.fg.controls['categoria'].value,
          Clasificacion: this.fg.controls['clasificacion'].value,
          Tipo: this.fg.controls['tipo'].value,
          Estado: this.fg.controls['estado'].value,
          Tipo_Analisis_1_Cons: this.fg.controls['crit1Consolidacion'].value,
          Tipo_Analisis_2_Cons: this.fg.controls['crit2Consolidacion'].value,
          Tipo_Analisis_3_Cons: this.fg.controls['crit3Consolidacion'].value,
          Tipo_Analisis_4_Cons: this.fg.controls['crit4Consolidacion'].value,
          Tipo_Analisis_5_Cons: this.fg.controls['crit5Consolidacion'].value,
          SeUtiliza: this.fg.controls['seUtiliza'].value.join(', '),
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
        subscriber.error(err.message || err);
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
                subscriber.error(err.message || err);
              },
            })
        );
      } catch (err: any) {
        throw new Error(err);
      }
    });
  }

  loadGrupoCuenta(): Observable<ClasificadorCuentasQueryResponse> {
    this.grupoCuentas$.next([]);

    return new Observable(subscriber => {
      try {
        this.subscription.push(
          this._apolloSvc
            .watchQuery<ClasificadorCuentasQueryResponse>(
              clasificadorCuentaApi.grupoCuenta
            )
            .subscribe(res => {
              this.grupoCuentas$.next(res.getAllGrupoCuenta);
              subscriber.next();
            })
        );
      } catch (err: any) {
        subscriber.error(err.message || err);
      }
    });
  }

  loadClaseCuenta(
    idGrupo: string
  ): Observable<ClasificadorCuentasQueryResponse> {
    return new Observable(subscriber => {
      try {
        this.subscription.push(
          this._apolloSvc
            .watchQuery<ClasificadorCuentasQueryResponse>(
              clasificadorCuentaApi.claseCuenta,
              { idGrupo }
            )
            .subscribe(res => {
              this.claseCuentas$.next(res.getClaseCuentaByIdGrupo);
              subscriber.next();
            })
        );
      } catch (err: any) {
        subscriber.error(err.message || err);
      }
    });
  }

  loadCategoriaCuenta(
    idClase: number
  ): Observable<ClasificadorCuentasQueryResponse> {
    return new Observable(subscriber => {
      try {
        this.subscription.push(
          this._apolloSvc
            .watchQuery<ClasificadorCuentasQueryResponse>(
              clasificadorCuentaApi.categoriaCuenta,
              { idClase }
            )
            .subscribe(res => {
              this.categoriaCuentas$.next(res.getCategoriaCuentaByIdClase);
              subscriber.next();
            })
        );
      } catch (err: any) {
        subscriber.error(err.message || err);
      }
    });
  }
}

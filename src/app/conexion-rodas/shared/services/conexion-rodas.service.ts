import { toNumber } from 'lodash';
import { conexionRodasApi } from './../graphql/conexion-rodasActions';
import {
  ConexionRodasQueryResponse,
  ConexionRodasMutationResponse,
} from './../models/conexion-rodas.model';
import { Apollo } from 'apollo-angular';
import { FormGroup, FormControl } from '@angular/forms';
import { Injectable } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

@Injectable()
export class ConexionRodasService {
  fg = new FormGroup({
    id: new FormControl('', { initialValueIsDefault: true }),
    idDivision: new FormControl('', { initialValueIsDefault: true }),
    idUnidad: new FormControl(null, { initialValueIsDefault: true }),
    consolidado: new FormControl('', { initialValueIsDefault: true }),
    ip: new FormControl('', { initialValueIsDefault: true }),
    usuario: new FormControl('', { initialValueIsDefault: true }),
    contrasena: new FormControl('', { initialValueIsDefault: true }),
    baseDatos: new FormControl(null, { initialValueIsDefault: true }),
  });

  subscription: Subscription[] = [];

  constructor(private _apollo: Apollo) {}

  loadAllConexionesRodas(): Observable<ConexionRodasQueryResponse> {
    return new Observable<ConexionRodasQueryResponse>(subscriber => {
      try {
        this.subscription.push(
          this._apollo
            .watchQuery<ConexionRodasQueryResponse>({
              query: conexionRodasApi.all,
              fetchPolicy: 'network-only',
            })
            .valueChanges.subscribe({
              next: res => {
                subscriber.next(res.data);
              },
              error: err => {
                subscriber.error(err);
              },
            })
        );
      } catch (err: any) {
        subscriber.error(err.message || err);
      }
    });
  }

  loadConexionById(id: number): Observable<ConexionRodasQueryResponse> {
    return new Observable<ConexionRodasQueryResponse>(subscriber => {
      this.subscription.push(
        this._apollo
          .query<ConexionRodasQueryResponse>({
            query: conexionRodasApi.byId,
            variables: { id },
            fetchPolicy: 'network-only',
          })
          .subscribe({
            next: res => {
              subscriber.next(res.data);
              subscriber.complete();
            },
            error: err => {
              subscriber.error(err);
            },
          })
      );
    });
  }

  save(): Observable<ConexionRodasMutationResponse> {
    return new Observable<ConexionRodasMutationResponse>(subscriber => {
      try {
        const _conexionInfo = {
          Id: toNumber(this.fg.controls['id'].value),
          IdUnidad: toNumber(this.fg.controls['idUnidad'].value),
          Consolidado: this.fg.controls['consolidado'].value || false,
          IdDivision: toNumber(this.fg.controls['idDivision'].value),
          IpRodas: this.fg.controls['ip'].value,
          // Usuario: this.fg.controls['usuario'].value,
          // Contrasena: this.fg.controls['contrasena'].value,
          BaseDatos: this.fg.controls['baseDatos'].value,
        };

        const mutation =
          _conexionInfo.Id === 0
            ? conexionRodasApi.create
            : conexionRodasApi.update;

        this.subscription.push(
          this._apollo
            .mutate<ConexionRodasMutationResponse>({
              mutation: mutation,
              variables: { conexionInfo: _conexionInfo },
              refetchQueries: ['GetAllContaConexiones'],
            })
            .subscribe({
              next: res => subscriber.next(res.data || undefined),
              error: err => subscriber.error(err.message || err),
            })
        );
      } catch (err: any) {
        subscriber.error(err.message || err);
      }
    });
  }

  delete(IDs: number[]): Observable<ConexionRodasMutationResponse> {
    return new Observable<ConexionRodasMutationResponse>(subscriber => {
      this.subscription.push(
        this._apollo
          .mutate<ConexionRodasMutationResponse>({
            mutation: conexionRodasApi.delete,
            variables: { IDs },
            refetchQueries: ['GetAllContaConexiones'],
          })
          .subscribe(res => {
            subscriber.next(res.data || undefined);
          })
      );
    });
  }

  getEntidadesRodas(): Observable<ConexionRodasQueryResponse> {
    const ip = this.fg.get('ip')?.value;

    return new Observable<ConexionRodasQueryResponse>(subscribe => {
      this._apollo
        .query<ConexionRodasQueryResponse>({
          query: conexionRodasApi.entidades,
          variables: { ip },
          fetchPolicy: 'network-only',
        })
        .subscribe({
          next: res => {
            subscribe.next(res.data);
          },
          error: err => {
            subscribe.error(err);
          },
        });
    });
  }

  public async getEstadoConexionDefinition(data: any): Promise<any> {
    const definition = [];

    if (data.length) {
      definition.push(this._getEstadoConexionTable(data));
    }

    return definition;
  }

  private _getEstadoConexionTable(chequeaConexion: any): any {
    const returnValue = [];

    returnValue.push({
      table: {
        widths: [300, 100],
        body: [
          [
            {
              text: 'Unidad',
              style: 'tableHeader',
            },
            {
              text: 'Estado',
              style: 'tableHeader',
            },
          ],
          ...chequeaConexion.map((p: { Unidad: any; Estado: any }) => {
            return [p.Unidad, p.Estado];
          }),
        ],
        margin: [0, 10, 0, 10],
      },
    });

    return returnValue;
  }

  dispose(): void {
    this.subscription.forEach(subs => subs.unsubscribe());
  }
}

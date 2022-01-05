import { toNumber } from 'lodash';
import { conexionRodasApi } from './../graphql/conexion-rodasActions';
import { ConexionRodasQueryResponse, ConexionRodasMutationResponse } from './../models/conexion-rodas.model';
import { Apollo } from 'apollo-angular';
import { FormGroup, FormControl } from '@angular/forms';
import { Injectable } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConexionRodasService {
  fg = new FormGroup({
    id: new FormControl(''),
    idUnidad: new FormControl(''),
    consolidado: new FormControl(''),
    ip: new FormControl(''),
    usuario: new FormControl(''),
    contrasena: new FormControl(''),
    baseDatos: new FormControl(''),
    idDivision: new FormControl(''),
  });

  subscription: Subscription[] = [];

  constructor(
    private _apollo: Apollo,
  ) { }

  loadAllConexionesRodas(): Observable<ConexionRodasQueryResponse> {
    return new Observable<ConexionRodasQueryResponse>(subscriber => {
      try {
        this.subscription.push(this._apollo.watchQuery<ConexionRodasQueryResponse>({
          query: conexionRodasApi.all,
          fetchPolicy: 'network-only'
        }).valueChanges.subscribe(response => {
          subscriber.next(response.data);
        }));
      } catch (err: any) {
        subscriber.error(err);
      }
    });
  }

  loadConexionById(id: number): Observable<ConexionRodasQueryResponse> {
    return new Observable<ConexionRodasQueryResponse>(subscriber => {
      this.subscription.push(this._apollo.query<ConexionRodasQueryResponse>({
        query: conexionRodasApi.byId,
        variables: { id },
        fetchPolicy: 'network-only'
      }).subscribe(response => {
        subscriber.next(response.data);
        subscriber.complete();
      }));
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
          Usuario: this.fg.controls['usuario'].value,
          Contrasena: this.fg.controls['contrasena'].value,
          BaseDatos: this.fg.controls['baseDatos'].value,
        };

        this.subscription.push(this._apollo.mutate<ConexionRodasMutationResponse>({
          mutation: conexionRodasApi.save,
          variables: { conexionInfo: _conexionInfo },
          refetchQueries: ['GetAllContaConexiones', 'GetContaConexionesByIdDivision']
        }).subscribe(response => {
          subscriber.next(response.data || undefined);
        }));
      } catch (err: any) {
        subscriber.error(err);
      }
    });
  }

  delete(id: number): Observable<ConexionRodasMutationResponse> {
    return new Observable<ConexionRodasMutationResponse>(subscriber => {
      this.subscription.push(this._apollo.mutate<ConexionRodasMutationResponse>({
        mutation: conexionRodasApi.delete,
        variables: { id },
        refetchQueries: ['GetAllContaConexiones', 'GetContaConexionesByIdDivision']
      }).subscribe(response => {
        subscriber.next(response.data || undefined);
      }));
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
          [{
            text: 'Unidad',
            style: 'tableHeader'
          },
          {
            text: 'Estado',
            style: 'tableHeader'
          }],
          ...chequeaConexion.map((p: { Unidad: any; Estado: any; }) => {
            return [p.Unidad, p.Estado];
          })
        ],
        margin: [0, 10, 0, 10]
      }
    });

    return returnValue;
  }

  dispose(): void {
    this.subscription.forEach(subs => subs.unsubscribe());
  }

}

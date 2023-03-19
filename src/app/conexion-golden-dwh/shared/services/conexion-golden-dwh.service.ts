import { conexionDWHApi } from './../graphql/conexion-dwhActions';
import { Apollo } from 'apollo-angular';
import { FormGroup, FormControl } from '@angular/forms';
import { Injectable } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import {
  ConexionDWHMutationResponse,
  ConexionDWHQueryResponse,
} from '../models/conexion-dwh.model';
import { toNumber } from 'lodash';

const updateConexionDwhMutation = require('graphql-tag/loader!../graphql/update-conexion-dwh.mutation.gql');

@Injectable()
export class ConexionGoldenDwhService {
  fg: FormGroup = new FormGroup({
    idUnidad: new FormControl(null, { initialValueIsDefault: true }),
    dwh_ip: new FormControl('', { initialValueIsDefault: true }),
    dwh_usuario: new FormControl('', { initialValueIsDefault: true }),
    dwh_contrasena: new FormControl('', { initialValueIsDefault: true }),
    dwh_baseDatos: new FormControl(null, { initialValueIsDefault: true }),
    rest_ip: new FormControl('', { initialValueIsDefault: true }),
    rest_usuario: new FormControl('', { initialValueIsDefault: true }),
    rest_contrasena: new FormControl('', { initialValueIsDefault: true }),
    rest_baseDatos: new FormControl(null, { initialValueIsDefault: true }),
  });

  subscription: Subscription[] = [];

  constructor(private _apollo: Apollo) {}

  loadDWHConexion(idDivision: number): Observable<ConexionDWHQueryResponse> {
    return new Observable<ConexionDWHQueryResponse>(subscriber => {
      this.subscription.push(
        this._apollo
          .query<ConexionDWHQueryResponse>({
            query: conexionDWHApi.byUnidad,
            variables: { idDivision },
            fetchPolicy: 'network-only',
          })
          .subscribe(reponse => {
            subscriber.next(reponse.data);
          })
      );
    });
  }

  save(): Observable<ConexionDWHMutationResponse> {
    const inputData = {
      IdUnidad: toNumber(this.fg.controls['idUnidad'].value),
      DWH_ip: this.fg.controls['dwh_ip'].value,
      DWH_usuario: this.fg.controls['dwh_usuario'].value,
      DWH_contrasena: this.fg.controls['dwh_contrasena'].value,
      DWH_baseDatos: this.fg.controls['dwh_baseDatos'].value,
      Rest_ip: this.fg.controls['rest_ip'].value,
      Rest_usuario: this.fg.controls['rest_usuario'].value,
      Rest_contrasena: this.fg.controls['rest_contrasena'].value,
      Rest_baseDatos: this.fg.controls['rest_baseDatos'].value,
    };

    return new Observable<ConexionDWHMutationResponse>(subscriber => {
      this.subscription.push(
        this._apollo
          .mutate<ConexionDWHMutationResponse>({
            mutation: updateConexionDwhMutation,
            variables: { dwhConexionInput: inputData },
            refetchQueries: ['GetDWHConexion'],
          })
          .subscribe(res => {
            subscriber.next(res.data || undefined);
          })
      );
    });
  }

  dispose() {
    this.subscription.forEach(subs => subs.unsubscribe());
  }
}

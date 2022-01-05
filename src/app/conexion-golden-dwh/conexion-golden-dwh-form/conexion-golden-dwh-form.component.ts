import { DatabasesService } from './../../shared/services/databases.service';
import { DivisionesService } from './../../shared/services/divisiones.service';
import { MaterialService } from './../../shared/services/material.service';
import { ModalService } from './../../shared/services/modal.service';
import { ConexionDWHMutationResponse, ConexionDWHQueryResponse } from './../shared/models/conexion-dwh.model';
import { toNumber } from 'lodash';
import { Router } from '@angular/router';
import { ConexionGoldenDwhService } from './../shared/services/conexion-golden-dwh.service';
import { FormGroup } from '@angular/forms';
import { Apollo } from 'apollo-angular';
import { Subscription } from 'rxjs';
import { ISelectableOptions } from './../../shared/models/selectable-item';
import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import SweetAlert from 'sweetalert2';
import { MatDialogRef } from '@angular/material/dialog';
import { conexionDWHApi } from '../shared/graphql/conexion-dwhActions';

const updateConexionDwhMutation = require('graphql-tag/loader!../shared/graphql/update-conexion-dwh.mutation.gql');

@Component({
  selector: 'app-conexion-golden-dwh-form',
  templateUrl: './conexion-golden-dwh-form.component.html',
  styleUrls: ['./conexion-golden-dwh-form.component.scss']
})
export class ConexionGoldenDwhFormComponent implements OnInit, AfterViewInit, OnDestroy {
  divisionesValues: ISelectableOptions[] = [];
  baseDatosRestValues: ISelectableOptions[] = [];
  baseDatosDWHValues: ISelectableOptions[] = [];

  subscription: Subscription[] = [];

  fg: FormGroup;

  loadingDWHDataBase = false;
  loadingRestDataBase = false;

  constructor(
    private _conexionDWHSvc: ConexionGoldenDwhService,
    private _apollo: Apollo,
    private _divisionesSvc: DivisionesService,
    private _databasesSvc: DatabasesService,
    private _modalSvc: ModalService,
    public router: Router,
    private _materialSvc: MaterialService,
    public dialogRef: MatDialogRef<ConexionGoldenDwhFormComponent>
  ) {
    dialogRef.afterClosed().subscribe(() => router.navigateByUrl(''));
  }

  ngOnInit(): void {
    this.fg = this._conexionDWHSvc.fg;

    this._subscribeToFgValueChange();
  }
  
  ngAfterViewInit(): void {
    this._getDivisiones();
  }

  ngOnDestroy(): void {
    this.subscription.forEach(subs => subs.unsubscribe());
  }

  private _getDivisiones(): void {
    try {
      this.subscription.push(this._divisionesSvc.getDivisiones().subscribe(response => {
        const result = response.getAllDivisiones;

        if (!result.success) {
          return SweetAlert.fire({
            icon: 'error',
            title: 'ERROR',
            text: result.error,
            showConfirmButton: true,
            confirmButtonText: 'Aceptar'
          });
        }

        this.divisionesValues = result.data.map((d: { IdDivision: string; Division: string; }) => {
          return {
            value: d.IdDivision,
            description: d.IdDivision + '-' + d.Division
          };
        });
      }));
    } catch (err: any) {
      SweetAlert.fire({
        icon: 'error',
        title: 'ERROR',
        text: err,
        showConfirmButton: true,
        confirmButtonText: 'Aceptar'
      });
    }
  }

  private _subscribeToFgValueChange(): void {
    this.subscription.push(this.fg.controls['idUnidad'].valueChanges.subscribe(value => {
      if (value) {
        this._getDWHConexion(value);
      }
    }));

    // Golden DWH Tab
    this.subscription.push(this.fg.controls['dwh_ip'].valueChanges.subscribe(() => {
      this.fg.controls['dwh_baseDatos'].setValue('');
      this.baseDatosDWHValues = [];
    }));

    this.subscription.push(this.fg.controls['dwh_usuario'].valueChanges.subscribe(() => {
      this.fg.controls['dwh_baseDatos'].setValue('');
      this.baseDatosDWHValues = [];
    }));

    this.subscription.push(this.fg.controls['dwh_contrasena'].valueChanges.subscribe(() => {
      this.fg.controls['dwh_baseDatos'].setValue('');
      this.baseDatosDWHValues = [];
    }));

    // Golden Restaura Tab
    this.subscription.push(this.fg.controls['rest_ip'].valueChanges.subscribe(() => {
      this.fg.controls['rest_baseDatos'].setValue('');
      this.baseDatosRestValues = [];
    }));

    this.subscription.push(this.fg.controls['rest_usuario'].valueChanges.subscribe(() => {
      this.fg.controls['rest_baseDatos'].setValue('');
      this.baseDatosRestValues = [];
    }));

    this.subscription.push(this.fg.controls['rest_contrasena'].valueChanges.subscribe(() => {
      this.fg.controls['rest_baseDatos'].setValue('');
      this.baseDatosRestValues = [];
    }));
  }

  private _getDWHConexion(idDivision: any): void {
    this.subscription.push(this._apollo.query<ConexionDWHQueryResponse>({
      query: conexionDWHApi.byUnidad,
      variables: { idDivision },
      fetchPolicy: 'network-only'
    }).subscribe(response => {
      const result = response.data.getDWHConexion;

      if (!result.success) {
        return SweetAlert.fire({
          icon: 'error',
          title: 'ERROR',
          text: result.error,
          showConfirmButton: true,
          confirmButtonText: 'Aceptar'
        });
      }

      const conexionRest = JSON.parse(result.data.ConexionRest);
      const conexionDWH = JSON.parse(result.data.ConexionDWH);

      const inputValues = {
        rest_ip: conexionRest.Server,
        rest_usuario: conexionRest.User,
        rest_contrasena: conexionRest.Password,
        rest_baseDatos: conexionRest.Database,
        dwh_ip: conexionDWH.Server,
        dwh_usuario: conexionDWH.User,
        dwh_contrasena: conexionDWH.Password,
        dwh_baseDatos: conexionDWH.Database,
      };

      this.fg.patchValue(inputValues);

      if (inputValues.dwh_ip && inputValues.dwh_usuario && inputValues.dwh_contrasena && inputValues.dwh_baseDatos) {
        this.refreshDataBases('DWH');
      }
      if (inputValues.rest_ip && inputValues.rest_usuario && inputValues.rest_contrasena && inputValues.rest_baseDatos) {
        this.refreshDataBases('Rest');
      }
    }));
  }

  refreshDataBases(tipo: string): void {
    try {
      let ip = '';
      let usuario = '';
      let password = '';

      if (tipo === 'DWH') {
        this.loadingDWHDataBase = true;

        ip = this.fg.controls['dwh_ip'].value;
        usuario = this.fg.controls['dwh_usuario'].value;
        password = this.fg.controls['dwh_contrasena'].value;
      } else {
        this.loadingRestDataBase = true;

        ip = this.fg.controls['rest_ip'].value;
        usuario = this.fg.controls['rest_usuario'].value;
        password = this.fg.controls['rest_contrasena'].value;
      }

      const that = this;
      this.subscription.push(this._databasesSvc.getDataBases(ip, usuario, password).subscribe(response => {
        this.loadingDWHDataBase = false;
        this.loadingRestDataBase = false;

        const result = response.getDataBases;

        if (!result.success) {
          return SweetAlert.fire({
            icon: 'error',
            title: 'ERROR',
            text: result.error,
            showConfirmButton: true,
            confirmButtonText: 'Aceptar'
          });
        }

        if (tipo === 'DWH') {
          that.baseDatosDWHValues = result.data.map((d: { name: any; }) => {
            return {
              value: d.name,
              description: d.name
            };
          });
        } else {
          that.baseDatosRestValues = result.data.map((d: { name: any; }) => {
            return {
              value: d.name,
              description: d.name
            };
          });
        }
      }));
    } catch (err: any) {
      this.loadingDWHDataBase = false;
      this.loadingRestDataBase = false;

      SweetAlert.fire({
        icon: 'error',
        title: 'ERROR',
        text: err,
        showConfirmButton: true,
        confirmButtonText: 'Aceptar'
      });
    }
  }

  save(): void {
    try {
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

      this.subscription.push(this._apollo.mutate<ConexionDWHMutationResponse>({
        mutation: updateConexionDwhMutation,
        variables: { dwhConexionInput: inputData },
        refetchQueries: ['GetDWHConexion']
      }).subscribe(response => {
        const result = response.data?.updateDWhConexion;

        if (!result?.success) {
          return SweetAlert.fire({
            icon: 'error',
            title: 'ERROR',
            text: result?.error,
            showConfirmButton: true,
            confirmButtonText: 'Aceptar'
          });
        }

        this._modalSvc.closeModal();

        this._materialSvc.openSnackBar('La Conexión se ha actualizado correctamente.');
      }));
    } catch (err: any) {
      SweetAlert.fire({
        icon: 'error',
        title: 'ERROR',
        text: err,
        showConfirmButton: true,
        confirmButtonText: 'Aceptar'
      });
    }
  }

}

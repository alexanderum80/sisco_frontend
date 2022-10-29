import { Subscription } from 'rxjs';
import { ActionClicked } from './../../shared/models/list-items';
import { DatabasesService } from './../../shared/services/databases.service';
import { DivisionesService } from './../../shared/services/divisiones.service';
import { DinamicDialogService } from './../../shared/ui/prime-ng/dinamic-dialog/dinamic-dialog.service';
import { Router } from '@angular/router';
import { ConexionGoldenDwhService } from './../shared/services/conexion-golden-dwh.service';
import { FormGroup } from '@angular/forms';
import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import SweetAlert from 'sweetalert2';
import { SelectItem } from 'primeng/api';

@Component({
  selector: 'app-conexion-golden-dwh-form',
  templateUrl: './conexion-golden-dwh-form.component.html',
  styleUrls: ['./conexion-golden-dwh-form.component.scss'],
})
export class ConexionGoldenDwhFormComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  divisionesValues: SelectItem[] = [];
  baseDatosRestValues: SelectItem[] = [];
  baseDatosDWHValues: SelectItem[] = [];

  fg: FormGroup;

  loadingDWHDataBase = false;
  loadingRestDataBase = false;

  subscription: Subscription[] = [];

  constructor(
    private _conexionDWHSvc: ConexionGoldenDwhService,
    private _divisionesSvc: DivisionesService,
    private _databasesSvc: DatabasesService,
    private _dinamicDialogSvc: DinamicDialogService,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.fg = this._conexionDWHSvc.fg;

    this._subscribeToFgValueChange();
  }

  ngAfterViewInit(): void {
    this._getDivisiones();
  }

  ngOnDestroy(): void {
    this._conexionDWHSvc.dispose();
  }

  private _getDivisiones(): void {
    try {
      this._conexionDWHSvc.subscription.push(
        this._divisionesSvc.getDivisiones().subscribe(response => {
          const result = response.getAllDivisiones;

          if (!result.success) {
            return SweetAlert.fire({
              icon: 'error',
              title: 'ERROR',
              text: result.error,
              showConfirmButton: true,
              confirmButtonText: 'Aceptar',
            });
          }

          this.divisionesValues = result.data.map(
            (d: { IdDivision: string; Division: string }) => {
              return {
                value: d.IdDivision,
                label: d.IdDivision + '-' + d.Division,
              };
            }
          );
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

  private _subscribeToFgValueChange(): void {
    this.subscription.push(
      this.fg.controls['idUnidad'].valueChanges.subscribe(value => {
        if (value) {
          this._getDWHConexion(value);
        }
      })
    );

    // Golden DWH Tab
    this.subscription.push(
      this.fg.controls['dwh_ip'].valueChanges.subscribe(() => {
        this.fg.controls['dwh_baseDatos'].setValue(null);
        this.baseDatosDWHValues = [];
      })
    );

    this.subscription.push(
      this.fg.controls['dwh_usuario'].valueChanges.subscribe(() => {
        this.fg.controls['dwh_baseDatos'].setValue(null);
        this.baseDatosDWHValues = [];
      })
    );

    this.subscription.push(
      this.fg.controls['dwh_contrasena'].valueChanges.subscribe(() => {
        this.fg.controls['dwh_baseDatos'].setValue(null);
        this.baseDatosDWHValues = [];
      })
    );

    // Golden Restaura Tab
    this.subscription.push(
      this.fg.controls['rest_ip'].valueChanges.subscribe(() => {
        this.fg.controls['rest_baseDatos'].setValue(null);
        this.baseDatosRestValues = [];
      })
    );

    this.subscription.push(
      this.fg.controls['rest_usuario'].valueChanges.subscribe(() => {
        this.fg.controls['rest_baseDatos'].setValue(null);
        this.baseDatosRestValues = [];
      })
    );

    this.subscription.push(
      this.fg.controls['rest_contrasena'].valueChanges.subscribe(() => {
        this.fg.controls['rest_baseDatos'].setValue(null);
        this.baseDatosRestValues = [];
      })
    );
  }

  private _getDWHConexion(idDivision: any): void {
    this._conexionDWHSvc.subscription.push(
      this._conexionDWHSvc.loadDWHConexion(idDivision).subscribe(response => {
        const result = response.getDWHConexion;

        if (!result.success) {
          return SweetAlert.fire({
            icon: 'error',
            title: 'ERROR',
            text: result.error,
            showConfirmButton: true,
            confirmButtonText: 'Aceptar',
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

        if (
          inputValues.dwh_ip &&
          inputValues.dwh_usuario &&
          inputValues.dwh_contrasena &&
          inputValues.dwh_baseDatos
        ) {
          this.refreshDataBases('DWH');
        }
        if (
          inputValues.rest_ip &&
          inputValues.rest_usuario &&
          inputValues.rest_contrasena &&
          inputValues.rest_baseDatos
        ) {
          this.refreshDataBases('Rest');
        }
      })
    );
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
      this._conexionDWHSvc.subscription.push(
        this._databasesSvc
          .getDataBases(ip, usuario, password)
          .subscribe(response => {
            this.loadingDWHDataBase = false;
            this.loadingRestDataBase = false;

            const result = response.getDataBases;

            if (!result.success) {
              return SweetAlert.fire({
                icon: 'error',
                title: 'ERROR',
                text: result.error,
                showConfirmButton: true,
                confirmButtonText: 'Aceptar',
              });
            }

            if (tipo === 'DWH') {
              that.baseDatosDWHValues = result.data.map((d: { name: any }) => {
                return {
                  value: d.name,
                  label: d.name,
                };
              });
            } else {
              that.baseDatosRestValues = result.data.map((d: { name: any }) => {
                return {
                  value: d.name,
                  label: d.name,
                };
              });
            }
          })
      );
    } catch (err: any) {
      this.loadingDWHDataBase = false;
      this.loadingRestDataBase = false;

      SweetAlert.fire({
        icon: 'error',
        title: 'ERROR',
        text: err,
        showConfirmButton: true,
        confirmButtonText: 'Aceptar',
      });
    }
  }

  onActionClicked(action: ActionClicked) {
    switch (action) {
      case ActionClicked.Save:
        this._save();
        break;
      case ActionClicked.Cancel:
        this._closeModal();
        break;
    }
  }

  private _save(): void {
    try {
      this._conexionDWHSvc.subscription.push(
        this._conexionDWHSvc.save().subscribe(response => {
          const result = response.updateDWhConexion;

          if (!result?.success) {
            return SweetAlert.fire({
              icon: 'error',
              title: 'ERROR',
              text: result?.error,
              showConfirmButton: true,
              confirmButtonText: 'Aceptar',
            });
          }

          this._dinamicDialogSvc.close();
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

  private _closeModal(message?: string): void {
    this.subscription.forEach(subs => subs.unsubscribe());
    this._dinamicDialogSvc.close(message);
  }
}

import { SweetalertService } from './../../shared/helpers/sweetalert.service';
import { ActionClicked } from './../../shared/models/list-items';
import { DatabasesService } from './../../shared/services/databases.service';
import { DivisionesService } from './../../shared/services/divisiones.service';
import { DinamicDialogService } from './../../shared/ui/prime-ng/dinamic-dialog/dinamic-dialog.service';
import { Router } from '@angular/router';
import { ConexionGoldenDwhService } from './../shared/services/conexion-golden-dwh.service';
import { FormGroup } from '@angular/forms';
import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ChangeDetectionStrategy,
  AfterContentChecked,
  ChangeDetectorRef,
} from '@angular/core';
import { SelectItem } from 'primeng/api';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-conexion-golden-dwh-form',
  templateUrl: './conexion-golden-dwh-form.component.html',
  styleUrls: ['./conexion-golden-dwh-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConexionGoldenDwhFormComponent
  implements OnInit, AfterViewInit, OnDestroy, AfterContentChecked
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
    private _swalSvc: SweetalertService,
    public router: Router,
    private _cd: ChangeDetectorRef,
    private _toastrSvc: ToastrService
  ) {}

  ngOnInit(): void {
    this.fg = this._conexionDWHSvc.fg;

    this._subscribeToFgValueChange();
  }

  ngAfterViewInit(): void {
    this._getDivisiones();
  }

  ngAfterContentChecked(): void {
    this._cd.detectChanges();
  }

  ngOnDestroy(): void {
    this._conexionDWHSvc.dispose();
  }

  private _getDivisiones(): void {
    try {
      this._conexionDWHSvc.subscription.push(
        this._divisionesSvc.getDivisionesByUsuario().subscribe({
          next: res => {
            const result = res.getAllDivisionesByUsuario;

            this.divisionesValues = result.map(d => {
              return {
                value: d.IdDivision,
                label: d.IdDivision + '-' + d.Division,
              };
            });
          },
          error: err => {
            this._swalSvc.error(err);
          },
        })
      );
    } catch (err: any) {
      this._swalSvc.error(err);
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
    this.subscription.forEach(subs => subs.unsubscribe());

    this._conexionDWHSvc.subscription.push(
      this._conexionDWHSvc.loadDWHConexion(idDivision).subscribe(res => {
        const result = res.getDWHConexion;

        if (!result.success) {
          this._swalSvc.error(result.error);
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

        this.fg.patchValue(inputValues, { onlySelf: true });

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

        this._subscribeToFgValueChange();
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
          .subscribe(res => {
            this.loadingDWHDataBase = false;
            this.loadingRestDataBase = false;

            const result = res.getDataBases;

            if (!result.success) {
              this._swalSvc.error(result.error);
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

      this._swalSvc.error(err);
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
        this._conexionDWHSvc.save().subscribe(res => {
          const result = res.updateDWhConexion;

          if (!result?.success) {
            this._swalSvc.error(result.error);
          }

          this._dinamicDialogSvc.close();

          this._toastrSvc.success(
            'La Conexión se ha establecido correctamente.'
          );
        })
      );
    } catch (err: any) {
      this._swalSvc.error(err);
    }
  }

  private _closeModal(message?: string): void {
    this.subscription.forEach(subs => subs.unsubscribe());
    this._dinamicDialogSvc.close(message);
  }
}

import { AuthenticationService } from './../../shared/services/authentication.service';
import { SweetalertService } from './../../shared/helpers/sweetalert.service';
import { Subscription } from 'rxjs';
import { ActionClicked } from './../../shared/models/list-items';
import { SelectItem } from 'primeng/api';
import { UnidadesService } from './../../unidades/shared/services/unidades.service';
import { DivisionesService } from './../../shared/services/divisiones.service';
import { ConexionRodasService } from './../shared/services/conexion-rodas.service';
import { FormGroup } from '@angular/forms';
import { DinamicDialogService } from './../../shared/ui/prime-ng/dinamic-dialog/dinamic-dialog.service';
import {
  Component,
  OnInit,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  AfterViewChecked,
} from '@angular/core';

@Component({
  selector: 'app-conexion-rodas-form',
  templateUrl: './conexion-rodas-form.component.html',
  styleUrls: ['./conexion-rodas-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConexionRodasFormComponent
  implements OnInit, AfterViewInit, AfterViewChecked
{
  divisionesValues: SelectItem[] = [];
  unidadesValues: SelectItem[] = [];
  baseDatosValues: SelectItem[] = [];

  action: ActionClicked;

  fg: FormGroup;

  subscription: Subscription[] = [];

  loadingEntidadesRodas = false;

  constructor(
    private _authSvc: AuthenticationService,
    private _conexionRodasSvc: ConexionRodasService,
    private _dinamicDialogSvc: DinamicDialogService,
    private _divisionesSvc: DivisionesService,
    private _unidadesSvc: UnidadesService,
    private cd: ChangeDetectorRef,
    private _swalSvc: SweetalertService
  ) {}

  ngOnInit(): void {
    this.fg = this._conexionRodasSvc.fg;

    this.action = !this.fg.controls['idUnidad'].value
      ? ActionClicked.Add
      : ActionClicked.Edit;
    if (this.action === ActionClicked.Edit) {
      this.getEntidadesRodas();
    }

    this._getDivisiones();
    this._getUnidades();
  }

  ngAfterViewInit(): void {
    this._subscribeToFgValueChange();
  }

  ngAfterViewChecked(): void {
    this.cd.detectChanges();
  }

  private _subscribeToFgValueChange(): void {
    this.subscription.push(
      this.fg.controls['idDivision'].valueChanges.subscribe(() => {
        this.fg.controls['idUnidad'].setValue(null);
        this._getUnidades();
      })
    );

    this.subscription.push(
      this.fg.controls['ip'].valueChanges.subscribe(() => {
        this.fg.controls['baseDatos'].setValue(null);
        this.baseDatosValues = [];
      })
    );

    this.subscription.push(
      this.fg.controls['usuario'].valueChanges.subscribe(() => {
        this.fg.controls['baseDatos'].setValue(null);
        this.baseDatosValues = [];
      })
    );

    this.subscription.push(
      this.fg.controls['contrasena'].valueChanges.subscribe(() => {
        this.fg.controls['baseDatos'].setValue(null);
        this.baseDatosValues = [];
      })
    );
  }

  get isAdminPermission(): boolean {
    return this._authSvc.hasAdminPermission();
  }

  private _getDivisiones(): void {
    try {
      this.subscription.push(
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
      return this._swalSvc.error(err);
    }
  }

  private _getUnidades(): void {
    try {
      this.unidadesValues = [];
      const idDivision = this.fg.controls['idDivision'].value;

      if (!idDivision) return;

      this.subscription.push(
        this._unidadesSvc.getUnidadesByIdDivision(idDivision).subscribe({
          next: res => {
            const data = res.getUnidadesByIdDivision;

            this.unidadesValues = data.map(
              (u: { IdUnidad: number; Nombre: string }) => {
                return {
                  value: u.IdUnidad,
                  label: u.Nombre,
                };
              }
            );
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

  getEntidadesRodas(): void {
    try {
      this.loadingEntidadesRodas = true;

      const that = this;
      this.subscription.push(
        this._conexionRodasSvc.getEntidadesRodas().subscribe({
          next: res => {
            this.loadingEntidadesRodas = false;

            that.baseDatosValues = res.entidadesRodas.map(d => {
              return {
                value: d.sigla,
                label: d.entidad,
              };
            });
          },
          error: err => {
            this.loadingEntidadesRodas = false;
            return this._swalSvc.error(err.message || err);
          },
        })
      );
    } catch (err: any) {
      this.loadingEntidadesRodas = false;
      this._swalSvc.error(err);
    }
  }

  // refreshDataBases(): void {
  //   try {
  //     this.loadingDataBase = true;

  //     const ip = this.fg.controls['ip'].value;
  //     const usuario = this.fg.controls['usuario'].value;
  //     const password = this.fg.controls['contrasena'].value;

  //     const that = this;
  //     this._conexionRodasSvc.subscription.push(
  //       this._databasesSvc
  //         .getDataBases(ip, usuario, password)
  //         .subscribe(res => {
  //           this.loadingDataBase = false;

  //           const result = res.getDataBases;

  //           if (!result.success) {
  //             return SweetAlert.fire({
  //               icon: 'error',
  //               title: 'ERROR',
  //               text: result.error,
  //               showConfirmButton: true,
  //               confirmButtonText: 'Aceptar',
  //             });
  //           }

  //           that.baseDatosValues = result.data.map((d: { name: any }) => {
  //             return {
  //               value: d.name,
  //               label: d.name,
  //             };
  //           });
  //         })
  //     );
  //   } catch (err: any) {
  //     this.loadingDataBase = false;

  //     SweetAlert.fire({
  //       icon: 'error',
  //       title: 'ERROR',
  //       text: err,
  //       showConfirmButton: true,
  //       confirmButtonText: 'Aceptar',
  //     });
  //   }
  // }

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
      this.subscription.push(
        this._conexionRodasSvc.save().subscribe({
          next: (res: any) => {
            let result;
            let txtMessage;

            if (this.action === ActionClicked.Add) {
              result = res.createContaConexion;
              txtMessage = 'La Conexión se ha creado correctamente.';
            } else {
              result = res.updateContaConexion;
              txtMessage = 'La Conexión se ha actualizado correctamente.';
            }

            if (!result.success) {
              throw new Error(result.error);
            }

            this._closeModal(txtMessage);
          },
          error: error => {
            this._swalSvc.error(error);
          },
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

import { ActionClicked } from './../../shared/models/list-items';
import { DinamicDialogService } from './../../shared/ui/prime-ng/dinamic-dialog/dinamic-dialog.service';
import { TipoEntidadesService } from './../../tipo-entidades/shared/services/tipo-entidades.service';
import { ClasificadorCuentaService } from './../../clasificador-cuenta/shared/service/clasificador-cuenta.service';
import { EpigrafesService } from './../../epigrafes/shared/services/epigrafes.service';
import { ElementosGastosService } from './../shared/services/elementos-gastos.service';
import { FormGroup } from '@angular/forms';
import {
  Component,
  OnInit,
  AfterViewInit,
  AfterContentChecked,
  ChangeDetectorRef,
} from '@angular/core';
import { SelectItem } from 'primeng/api';
import { SweetalertService } from 'src/app/shared/helpers/sweetalert.service';
import { IEpigrafes } from 'src/app/epigrafes/shared/models/epigrafes.model';

@Component({
  selector: 'app-elementos-gastos-form',
  templateUrl: './elementos-gastos-form.component.html',
  styleUrls: ['./elementos-gastos-form.component.scss'],
  providers: [EpigrafesService, ClasificadorCuentaService],
})
export class ElementosGastosFormComponent
  implements OnInit, AfterViewInit, AfterContentChecked
{
  action: ActionClicked;

  fg: FormGroup;

  tipoEntidadValues: SelectItem[] = [];
  cuentasValues: SelectItem[] = [];
  epigrafesValues: SelectItem[] = [];

  loadingTipoEntidad = true;
  loadingCuentas = true;
  loadingEpigrafes = true;

  constructor(
    private _elementoGastoSvc: ElementosGastosService,
    private _tipoEntidadesSvc: TipoEntidadesService,
    private _epigrafesSvc: EpigrafesService,
    private _clasificadorCuentaSvc: ClasificadorCuentaService,
    private _dinamicDialogSvc: DinamicDialogService,
    private _swalSvc: SweetalertService,
    private _cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.fg = this._elementoGastoSvc.fg;

    this.action =
      this.fg.controls['elemento'].value === ''
        ? ActionClicked.Add
        : ActionClicked.Edit;
  }

  ngAfterViewInit(): void {
    this._loadTipoEntidades();
    this._loadEpigrafes();
    this._loadCuentas();
  }

  ngAfterContentChecked(): void {
    this._cd.detectChanges();
  }

  private _loadTipoEntidades(): void {
    try {
      this._elementoGastoSvc.subscription.push(
        this._tipoEntidadesSvc.loadAllTipoEntidades().subscribe({
          next: res => {
            this.loadingTipoEntidad = false;

            const result = res.getAllTipoEntidades;
            if (result.success) {
              this.tipoEntidadValues = result.data.map(
                (tipo: { Id: any; Entidades: any }) => {
                  return {
                    value: tipo.Id,
                    label: tipo.Entidades,
                  };
                }
              );
            }
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

  private _loadEpigrafes(): void {
    try {
      this._elementoGastoSvc.subscription.push(
        this._epigrafesSvc.loadAllEpigrafes().subscribe({
          next: res => {
            this.loadingEpigrafes = false;

            this.epigrafesValues = res.getAllEpigrafes.map(
              (epigrafe: IEpigrafes) => {
                return {
                  value: epigrafe.IdEpigrafe,
                  label: epigrafe.Epigrafe,
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

  private _loadCuentas(): void {
    try {
      this._elementoGastoSvc.subscription.push(
        this._clasificadorCuentaSvc.loadCuentasAgrupadas().subscribe({
          next: res => {
            this.loadingCuentas = false;

            this.cuentasValues = res.getCuentasAgrupadas.map(
              (cuenta: { Cuenta: any }) => {
                return {
                  value: cuenta.Cuenta,
                  label: cuenta.Cuenta,
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
      this._elementoGastoSvc.save().subscribe({
        next: res => {
          let result;

          result = res.saveElementoGasto;
          if (!result.success) {
            this._swalSvc.error(result.error);
          }

          let txtMessage;
          if (this.action === ActionClicked.Add) {
            txtMessage = 'El Elemento de Gasto se ha creado correctamente.';
          } else {
            txtMessage =
              'El Elemento de Gasto se ha actualizado correctamente.';
          }

          this._closeModal(txtMessage);
        },
        error: err => {
          this._swalSvc.error(err);
        },
      });
    } catch (err: any) {
      this._swalSvc.error(err);
    }
  }

  private _closeModal(message?: string): void {
    this._dinamicDialogSvc.close(message);
  }
}

import { MaterialService } from './../../shared/services/material.service';
import { ModalService } from './../../shared/services/modal.service';
import SweetAlert from 'sweetalert2';
import { TipoEntidadesService } from './../../tipo-entidades/shared/services/tipo-entidades.service';
import { ClasificadorCuentaService } from './../../clasificador-cuenta/shared/service/clasificador-cuenta.service';
import { EpigrafesService } from './../../epigrafes/shared/services/epigrafes.service';
import { ISelectableOptions } from './../../shared/models/selectable-item';
import { ElementosGastosService } from './../shared/services/elementos-gastos.service';
import { Subscription } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { MutationActions } from './../../shared/models/mutation-response';
import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-elementos-gastos-form',
  templateUrl: './elementos-gastos-form.component.html',
  styleUrls: ['./elementos-gastos-form.component.scss']
})
export class ElementosGastosFormComponent implements OnInit, AfterViewInit, OnDestroy {
  action: MutationActions;
  fg: FormGroup;

  tipoEntidadValues: ISelectableOptions[] = [];
  cuentasValues: ISelectableOptions[] = [];
  epigrafesValues: ISelectableOptions[] = [];

  subscription: Subscription[] = [];

  constructor(
    private _elementoGastoSvc: ElementosGastosService,
    private _tipoEntidadesSvc: TipoEntidadesService,
    private _epigrafesSvc: EpigrafesService,
    private _clasificadorCuentaSvc: ClasificadorCuentaService,
    private _modalSvc: ModalService,
    private _materialSvc: MaterialService,
  ) { }

  ngOnInit(): void {
    this.fg = this._elementoGastoSvc.fg;

    this.action = this.fg.controls['elemento'].value === '' ? 'Agregar' : 'Modificar';
  }

  ngAfterViewInit(): void {
    this._loadTipoEntidades();
    this._loadEpigrafes();
    this._loadCuentas();
  }

  ngOnDestroy(): void {
    this.subscription.forEach(subs => subs.unsubscribe());
  }

  private _loadTipoEntidades(): void {
    try {
      this.subscription.push(this._tipoEntidadesSvc.loadAllTipoEntidades().subscribe(response => {
        const result = response.getAllTipoEntidades;
        if (result.success) {
          this.tipoEntidadValues = result.data.map((tipo: { Id: any; Entidades: any; }) => {
            return {
              value: tipo.Id,
              description: tipo.Entidades
            };
          });
        }
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

  private _loadEpigrafes(): void {
    try {
      this.subscription.push(this._epigrafesSvc.loadAllEpigrafes().subscribe(response => {
        const result = response.getAllEpigrafes;
        if (result.success) {
          this.epigrafesValues = result.data.map((epigrafe: { IdEpigafre: any; Epigrafe: any; }) => {
            return {
              value: epigrafe.IdEpigafre,
              description: epigrafe.Epigrafe
            };
          });
        }
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

  private _loadCuentas(): void {
    try {
      this.subscription.push(this._clasificadorCuentaSvc.loadCuentasAgrupadas().subscribe(res => {
        const result = res.getCuentasAgrupadas;
        if (!result.success) {
          return SweetAlert.fire({
            icon: 'error',
            title: 'ERROR',
            text: result.error,
            confirmButtonText: 'Aceptar'
          });
        }

        this.cuentasValues = res.getCuentasAgrupadas.data.map((cuenta: { Cuenta: any; }) => {
          return {
            value: cuenta.Cuenta,
            description: cuenta.Cuenta
          };
        });
      }, error => { throw new Error(error); }));
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

  save(): void {
    try {
      this._elementoGastoSvc.save().subscribe(response => {
        let result;

        result = response.saveElementoGasto;
        if (!result.success) {
          return SweetAlert.fire({
            icon: 'error',
            title: 'ERROR',
            text: result.error,
            showConfirmButton: true,
            confirmButtonText: 'Aceptar'
          });
        }

        let txtMessage;
        if (this.action === 'Agregar' ) {
          txtMessage = 'El Elemento de Gasto se ha creado correctamente.';
        } else {
          txtMessage = 'El Elemento de Gasto se ha actualizado correctamente.';
        }

        this.closeModal();

        this._materialSvc.openSnackBar(txtMessage);
      }, error => { throw new Error(error); });
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

  closeModal(): void {
    this._modalSvc.closeModal();
  }

}

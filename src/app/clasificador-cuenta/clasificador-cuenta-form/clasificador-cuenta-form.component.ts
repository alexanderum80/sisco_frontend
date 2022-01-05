import { ModalService } from './../../shared/services/modal.service';
import { MaterialService } from './../../shared/services/material.service';
import { TipoEntidadesService } from './../../tipo-entidades/shared/services/tipo-entidades.service';
import { MutationActions } from './../../shared/models/mutation-response';
import { Subscription } from 'rxjs';
import SweetAlert from 'sweetalert2';
import { ISelectableOptions } from './../../shared/models/selectable-item';
import { ClasificadorCuentaService } from './../shared/service/clasificador-cuenta.service';
import { FormGroup } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-clasificador-cuenta-form',
  templateUrl: './clasificador-cuenta-form.component.html',
  styleUrls: ['./clasificador-cuenta-form.component.scss']
})
export class ClasificadorCuentaFormComponent implements OnInit, OnDestroy {
  action: MutationActions;
  fg: FormGroup;

  naturalezaValues: ISelectableOptions[] = [
    { value: 'D', description: 'Deudora' },
    { value: 'A', description: 'Acreedora' },
  ];

  tipoClasificadorValues: ISelectableOptions[] = [
    { value: 1, description: 'Consolidado' },
    { value: 2, description: 'Centros' },
    { value: 3, description: 'Complejos' },
  ];

  tipoUnidadesValues: ISelectableOptions[] = [];

  subscription: Subscription[] = [];

  constructor(
    private _materialSvc: MaterialService,
    private _modalSvc: ModalService,
    private _tipoEntidadesSvc: TipoEntidadesService,
    private _clasificadorSvc: ClasificadorCuentaService
  ) { }

  ngOnInit(): void {
    this.fg = this._clasificadorSvc.fg;

    this.action = this.fg.controls['cuenta'].value === '' ? 'Agregar' : 'Modificar';

    this._loadTipoUnidades();
  }

  ngOnDestroy(): void {
    this.subscription.forEach(subs => subs.unsubscribe());
  }

  private _loadTipoUnidades(): void {
    try {
      this.subscription.push(this._tipoEntidadesSvc.loadAllTipoEntidades().subscribe(response => {
        const result = response.getAllTipoEntidades;
        if (!result.success) {
          return SweetAlert.fire({
            icon: 'error',
            title: 'ERROR',
            text: result.error,
            confirmButtonText: 'Aceptar'
          });
        }

        this.tipoUnidadesValues = result.data.map((tipo: { Id: any; Entidades: any; }) => {
          return {
            value: tipo.Id,
            description: tipo.Entidades
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
      this.subscription.push(this._clasificadorSvc.save().subscribe(response => {
        const result = response.saveClasificadorCuenta;
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

        if (this.action === 'Agregar') {
          txtMessage = 'La Cuenta se ha creado correctamente.';
        } else {
          txtMessage = 'La Cuenta se ha actualizado correctamente.';
        }

        this.closeModal();

        this._materialSvc.openSnackBar(txtMessage);
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

  closeModal(): void {
    this._modalSvc.closeModal();
  }

}

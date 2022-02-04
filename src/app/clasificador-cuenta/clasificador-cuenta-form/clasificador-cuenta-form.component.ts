import { DinamicDialogService } from './../../shared/ui/prime-ng/dinamic-dialog/dinamic-dialog.service';
import { ActionClicked } from './../../shared/models/list-items';
import { TipoEntidadesService } from './../../tipo-entidades/shared/services/tipo-entidades.service';
import SweetAlert from 'sweetalert2';
import { ClasificadorCuentaService } from './../shared/service/clasificador-cuenta.service';
import { FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/api';

@Component({
  selector: 'app-clasificador-cuenta-form',
  templateUrl: './clasificador-cuenta-form.component.html',
  styleUrls: ['./clasificador-cuenta-form.component.scss']
})
export class ClasificadorCuentaFormComponent implements OnInit {
  action: ActionClicked;
  fg: FormGroup;

  naturalezaValues: SelectItem[] = [
    { value: 'D', label: 'Deudora' },
    { value: 'A', label: 'Acreedora' },
  ];

  tipoClasificadorValues: SelectItem[] = [
    { value: 1, label: 'Consolidado' },
    { value: 2, label: 'Centro' },
    { value: 3, label: 'Complejo' },
  ];

  tipoUnidadesValues: SelectItem[] = [];

  constructor(
    private _dinamicDialogSvc: DinamicDialogService,
    private _tipoEntidadesSvc: TipoEntidadesService,
    private _clasificadorSvc: ClasificadorCuentaService
  ) { }

  ngOnInit(): void {
    this.fg = this._clasificadorSvc.fg;

    this.action = this.fg.controls['cuenta'].value === '' ? ActionClicked.Add : ActionClicked.Edit;

    this._loadTipoUnidades();
  }

  private _loadTipoUnidades(): void {
    try {
      this._clasificadorSvc.subscription.push(this._tipoEntidadesSvc.loadAllTipoEntidades().subscribe(response => {
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
            label: tipo.Entidades
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
      this._clasificadorSvc.subscription.push(this._clasificadorSvc.save().subscribe(response => {
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

        if (this.action === ActionClicked.Add) {
          txtMessage = 'La Cuenta se ha creado correctamente.';
        } else {
          txtMessage = 'La Cuenta se ha actualizado correctamente.';
        }

        this._closeModal(txtMessage);
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

  private _closeModal(message?: string): void {
    this._dinamicDialogSvc.close(message);
  }

}

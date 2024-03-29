import { ActionClicked } from './../../shared/models/list-items';
import SweetAlert from 'sweetalert2';
import { toNumber } from 'lodash';
import { FormGroup } from '@angular/forms';
import { DinamicDialogService } from './../../shared/ui/prime-ng/dinamic-dialog/dinamic-dialog.service';
import { TipoEntidadesService } from './../shared/services/tipo-entidades.service';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-tipo-entidades-form',
  templateUrl: './tipo-entidades-form.component.html',
  styleUrls: ['./tipo-entidades-form.component.scss'],
})
export class TipoEntidadesFormComponent implements OnInit {
  action: ActionClicked;

  fg: FormGroup;

  constructor(
    private _dinamicDialogSvc: DinamicDialogService,
    private _tipoEntidadesSvc: TipoEntidadesService
  ) {}

  ngOnInit(): void {
    this.fg = this._tipoEntidadesSvc.fg;
    this.action =
      toNumber(this.fg.controls['id'].value) === 0
        ? ActionClicked.Add
        : ActionClicked.Edit;
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
    this._tipoEntidadesSvc.subscription.push(
      this._tipoEntidadesSvc.save().subscribe(res => {
        let result;
        let txtMessage;

        if (this.action === ActionClicked.Add) {
          result = res.createTipoEntidad;
          txtMessage = 'El Tipo de Entidad se ha creado correctamente.';
        } else {
          result = res.updateTipoEntidad;
          txtMessage = 'El Tipo de Entidad se ha actualizado correctamente.';
        }

        if (!result.success) {
          return SweetAlert.fire({
            icon: 'error',
            title: 'ERROR',
            text: result.error,
            showConfirmButton: true,
            confirmButtonText: 'Aceptar',
          });
        }

        this._closeModal(txtMessage);
      })
    );
  }

  private _closeModal(message?: string): void {
    this._dinamicDialogSvc.close(message);
  }
}

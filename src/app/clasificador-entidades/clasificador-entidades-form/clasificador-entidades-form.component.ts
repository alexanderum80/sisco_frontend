import { ActionClicked } from './../../shared/models/list-items';
import { TipoEntidadesService } from './../../tipo-entidades/shared/services/tipo-entidades.service';
import { UnidadesService } from './../../unidades/shared/services/unidades.service';
import SweetAlert from 'sweetalert2';
import { toNumber } from 'lodash';
import { ClasificadorEntidadesService } from './../shared/services/clasificador-entidades.service';
import { DinamicDialogService } from './../../shared/ui/prime-ng/dinamic-dialog/dinamic-dialog.service';
import { FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/api';

@Component({
  selector: 'app-clasificador-entidades-form',
  templateUrl: './clasificador-entidades-form.component.html',
  styleUrls: ['./clasificador-entidades-form.component.scss'],
})
export class ClasificadorEntidadesFormComponent implements OnInit {
  unidadesValues: SelectItem[] = [];
  tipoEntidadesValues: SelectItem[] = [];

  action: ActionClicked;

  fg: FormGroup;

  constructor(
    private _dinamicDialogSvc: DinamicDialogService,
    private _clasificadorEntidadesSvc: ClasificadorEntidadesService,
    private _unidadesSvc: UnidadesService,
    private _tipoEntidadesSvc: TipoEntidadesService
  ) {}

  ngOnInit(): void {
    this.fg = this._clasificadorEntidadesSvc.fg;
    this.action =
      toNumber(this.fg.controls['idUnidad'].value) === 0
        ? ActionClicked.Add
        : ActionClicked.Edit;

    this._loadUnidades();
    this._loadTipoEntidades();
  }

  private _loadUnidades(): void {
    this._clasificadorEntidadesSvc.subscription.push(
      this._unidadesSvc.getAllUnidades().subscribe(response => {
        const result = response.getAllUnidades;
        if (!result.success) {
          return SweetAlert.fire({
            icon: 'error',
            title: 'ERROR',
            text: result.error,
            showConfirmButton: true,
            confirmButtonText: 'Aceptar',
          });
        }

        this.unidadesValues = result.data.map(
          (unidad: { IdUnidad: string; Nombre: string }) => {
            return {
              value: unidad.IdUnidad,
              label: unidad.IdUnidad + '-' + unidad.Nombre,
            };
          }
        );
      })
    );
  }

  private _loadTipoEntidades(): void {
    this._clasificadorEntidadesSvc.subscription.push(
      this._tipoEntidadesSvc.loadAllTipoEntidades().subscribe(response => {
        const result = response.getAllTipoEntidades;
        if (!result.success) {
          return SweetAlert.fire({
            icon: 'error',
            title: 'ERROR',
            text: result.error,
            showConfirmButton: true,
            confirmButtonText: 'Aceptar',
          });
        }

        this.tipoEntidadesValues = result.data.map(
          (tipoEntidad: { Id: any; Entidades: any }) => {
            return {
              value: tipoEntidad.Id,
              label: tipoEntidad.Entidades,
            };
          }
        );
      })
    );
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
    this._clasificadorEntidadesSvc.subscription.push(
      this._clasificadorEntidadesSvc.save(this.action).subscribe(response => {
        const result =
          this.action === ActionClicked.Add
            ? response.createClasificadorEntidad
            : response.updateClasificadorEntidad;

        if (!result.success) {
          return SweetAlert.fire({
            icon: 'error',
            title: 'ERROR',
            text: result.error,
            showConfirmButton: true,
            confirmButtonText: 'Aceptar',
          });
        }

        let txtMessage = `El Clasificador de Entidad se ha ${
          this.action === ActionClicked.Add ? 'creado' : 'actualizado'
        } correctamente.`;

        this._closeModal(txtMessage);
      })
    );
  }

  private _closeModal(message?: string): void {
    this._dinamicDialogSvc.close(message);
  }
}

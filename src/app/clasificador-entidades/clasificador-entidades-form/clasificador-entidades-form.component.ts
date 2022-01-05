import { TipoEntidadesService } from './../../tipo-entidades/shared/services/tipo-entidades.service';
import { UnidadesService } from './../../unidades/shared/services/unidades.service';
import { ISelectableOptions } from './../../shared/models/selectable-item';
import SweetAlert from 'sweetalert2';
import { toNumber } from 'lodash';
import { ClasificadorEntidadesService } from './../shared/services/clasificador-entidades.service';
import { MaterialService } from './../../shared/services/material.service';
import { ModalService } from './../../shared/services/modal.service';
import { MyErrorStateMatcher } from './../../angular-material/models/material-error-state-matcher';
import { FormGroup } from '@angular/forms';
import { MutationActions } from './../../shared/models/mutation-response';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-clasificador-entidades-form',
  templateUrl: './clasificador-entidades-form.component.html',
  styleUrls: ['./clasificador-entidades-form.component.scss']
})
export class ClasificadorEntidadesFormComponent implements OnInit, OnDestroy {
  unidadesValues: ISelectableOptions[] = [];
  tipoEntidadesValues: ISelectableOptions[] = [];

  action: MutationActions;

  fg: FormGroup;

  matcher = new MyErrorStateMatcher();

  subscription: Subscription[] = [];

  constructor(
    private _modalSvc: ModalService,
    private _materialSvc: MaterialService,
    private _clasificadorEntidadesSvc: ClasificadorEntidadesService,
    private _unidadesSvc: UnidadesService,
    private _tipoEntidadesSvc: TipoEntidadesService
  ) { }

  ngOnInit(): void {
    this.fg = this._clasificadorEntidadesSvc.fg;
    this.action = toNumber(this.fg.controls['idUnidad'].value) === 0 ? 'Agregar' : 'Modificar';

    this._loadUnidades();
    this._loadTipoEntidades();
  }

  ngOnDestroy(): void {
    this.subscription.forEach(subs => subs.unsubscribe());
  }

  private _loadUnidades(): void {
    this._unidadesSvc.getAllUnidades().subscribe(response => {
      const result = response.getAllUnidades;
      if (!result.success) {
        return SweetAlert.fire({
          icon: 'error',
          title: 'ERROR',
          text: result.error,
          showConfirmButton: true,
          confirmButtonText: 'Aceptar'
        });
      }

      this.unidadesValues = result.data.map((unidad: { IdUnidad: string; Nombre: string; }) => {
        return {
          value: unidad.IdUnidad,
          description: unidad.IdUnidad + '-' + unidad.Nombre
        };
      });
    });
  }

  private _loadTipoEntidades(): void {
    this._tipoEntidadesSvc.loadAllTipoEntidades().subscribe(response => {
      const result = response.getAllTipoEntidades;
      if (!result.success) {
        return SweetAlert.fire({
          icon: 'error',
          title: 'ERROR',
          text: result.error,
          showConfirmButton: true,
          confirmButtonText: 'Aceptar'
        });
      }

      this.tipoEntidadesValues = result.data.map((tipoEntidad: { Id: any; Entidades: any; }) => {
        return {
          value: tipoEntidad.Id,
          description: tipoEntidad.Entidades
        };
      });
    });
  }

  save(): void {
    this.subscription.push(this._clasificadorEntidadesSvc.save().subscribe(response => {
      const result = response.saveClasificadorEntidad;
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
        txtMessage = 'El Clasificador de Entidad se ha creado correctamente.';
      } else {
        txtMessage = 'El Clasificador de Entidad se ha actualizado correctamente.';
      }

      this.closeModal();

      this._materialSvc.openSnackBar(txtMessage);
    }));
  }

  closeModal(): void {
    this._modalSvc.closeModal();
  }

}

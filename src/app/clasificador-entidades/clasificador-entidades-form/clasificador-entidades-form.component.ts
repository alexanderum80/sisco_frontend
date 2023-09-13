import { ActionClicked } from './../../shared/models/list-items';
import { TipoEntidadesService } from './../../tipo-entidades/shared/services/tipo-entidades.service';
import { UnidadesService } from './../../unidades/shared/services/unidades.service';
import SweetAlert from 'sweetalert2';
import { toNumber } from 'lodash';
import { ClasificadorEntidadesService } from './../shared/services/clasificador-entidades.service';
import { DinamicDialogService } from './../../shared/ui/prime-ng/dinamic-dialog/dinamic-dialog.service';
import { FormGroup } from '@angular/forms';
import {
  AfterContentChecked,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { SelectItem } from 'primeng/api';
import { SweetalertService } from 'src/app/shared/helpers/sweetalert.service';
import { IUnidades } from 'src/app/unidades/shared/models/unidades.model';

@Component({
  selector: 'app-clasificador-entidades-form',
  templateUrl: './clasificador-entidades-form.component.html',
  styleUrls: ['./clasificador-entidades-form.component.scss'],
})
export class ClasificadorEntidadesFormComponent
  implements OnInit, AfterContentChecked
{
  unidadesValues: SelectItem[] = [];
  tipoEntidadesValues: SelectItem[] = [];

  action: ActionClicked;

  fg: FormGroup;

  constructor(
    private _dinamicDialogSvc: DinamicDialogService,
    private _clasificadorEntidadesSvc: ClasificadorEntidadesService,
    private _unidadesSvc: UnidadesService,
    private _swalSvc: SweetalertService,
    private _tipoEntidadesSvc: TipoEntidadesService,
    private _cd: ChangeDetectorRef
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

  ngAfterContentChecked(): void {
    this._cd.detectChanges();
  }

  private _loadUnidades(): void {
    this._clasificadorEntidadesSvc.subscription.push(
      this._unidadesSvc.getAllUnidadesByUsuario().subscribe({
        next: res => {
          const data = res.getAllUnidadesByUsuario;

          this.unidadesValues = data.map((unidad: IUnidades) => {
            return {
              value: unidad.IdUnidad,
              label: unidad.Nombre,
            };
          });
        },
        error: err => {
          this._swalSvc.error(err);
        },
      })
    );
  }

  private _loadTipoEntidades(): void {
    this._clasificadorEntidadesSvc.subscription.push(
      this._tipoEntidadesSvc.loadAllTipoEntidades().subscribe(res => {
        const result = res.getAllTipoEntidades;
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
      this._clasificadorEntidadesSvc.save(this.action).subscribe(res => {
        const result =
          this.action === ActionClicked.Add
            ? res.createClasificadorEntidad
            : res.updateClasificadorEntidad;

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

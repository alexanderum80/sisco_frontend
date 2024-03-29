import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from './../../shared/services/authentication.service';
import {
  DefaultInlineButtonsTable,
  DefaultTopLeftButtonsTable,
} from '../../shared/models/table-buttons';
import { IButtons } from './../../shared/ui/prime-ng/button/button.model';
import {
  IActionItemClickedArgs,
  ActionClicked,
} from './../../shared/models/list-items';
import { ITableColumns } from './../../shared/ui/prime-ng/table/table.model';
import { TipoEntidadesService } from './../shared/services/tipo-entidades.service';
import { DinamicDialogService } from './../../shared/ui/prime-ng/dinamic-dialog/dinamic-dialog.service';
import SweetAlert from 'sweetalert2';
import { TipoEntidadesFormComponent } from './../tipo-entidades-form/tipo-entidades-form.component';
import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { isArray } from 'lodash';

@Component({
  selector: 'app-list-tipo-entidades',
  templateUrl: './list-tipo-entidades.component.html',
  styleUrls: ['./list-tipo-entidades.component.scss'],
})
export class ListTipoEntidadesComponent implements AfterViewInit, OnDestroy {
  dataSource: any[];

  displayedColumns: ITableColumns[] = [
    { header: 'Entidades', field: 'Entidades', type: 'string' },
    { header: 'Descripción', field: 'Descripcion', type: 'string' },
  ];

  inlineButtons: IButtons[] = [];
  topLeftButtons: IButtons[] = [];

  loading = true;

  constructor(
    private _authSvc: AuthenticationService,
    private _dinamicDialogSvc: DinamicDialogService,
    private _toastrSvc: ToastrService,
    private _tipoEntidadesSvc: TipoEntidadesService
  ) {
    if (this.hasAdvancedUserPermission()) {
      this.inlineButtons = DefaultInlineButtonsTable;
      this.topLeftButtons = DefaultTopLeftButtonsTable;
    }
  }

  ngAfterViewInit(): void {
    this._loadAllTipoEntidades();
  }

  ngOnDestroy(): void {
    this._tipoEntidadesSvc.dispose();
  }

  private _loadAllTipoEntidades(): void {
    try {
      this._tipoEntidadesSvc.subscription.push(
        this._tipoEntidadesSvc.loadAllTipoEntidades().subscribe(res => {
          this.loading = false;

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

          this.dataSource = result.data;
        })
      );
    } catch (err: any) {
      SweetAlert.fire({
        icon: 'error',
        title: 'ERROR',
        text: err,
        showConfirmButton: true,
        confirmButtonText: 'Aceptar',
      });
    }
  }

  hasAdvancedUserPermission(): boolean {
    return this._authSvc.hasAdvancedUserPermission();
  }

  actionClicked(event: IActionItemClickedArgs) {
    switch (event.action) {
      case ActionClicked.Add:
        this._add();
        break;
      case ActionClicked.Edit:
        this._edit(event.item);
        break;
      case ActionClicked.Delete:
        this._delete(event.item);
        break;
    }
  }

  private _add(): void {
    try {
      if (this.hasAdvancedUserPermission()) {
        const inputData = {
          id: '',
          entidades: '',
          descripcion: '',
        };
        this._tipoEntidadesSvc.fg.patchValue(inputData);

        this._dinamicDialogSvc.open(
          'Agregar Tipo de Entidad',
          TipoEntidadesFormComponent
        );
        this._tipoEntidadesSvc.subscription.push(
          this._dinamicDialogSvc.ref.onClose.subscribe((message: string) => {
            if (message) {
              this._toastrSvc.success(message, 'Satisfactorio');
            }
          })
        );
      }
    } catch (err: any) {
      SweetAlert.fire({
        icon: 'error',
        title: 'ERROR',
        text: err,
        showConfirmButton: true,
        confirmButtonText: 'Aceptar',
      });
    }
  }

  private _edit(tipoEntidad: any): void {
    try {
      this._tipoEntidadesSvc.subscription.push(
        this._tipoEntidadesSvc
          .loadTipoEntidadById(tipoEntidad.Id)
          .subscribe(res => {
            const result = res.getTipoEntidadById;

            if (!result.success) {
              return SweetAlert.fire({
                icon: 'error',
                title: 'ERROR',
                text: result.error,
                showConfirmButton: true,
                confirmButtonText: 'Aceptar',
              });
            }

            const data = result.data;

            const inputData = {
              id: data.Id,
              entidades: data.Entidades,
              descripcion: data.Descripcion,
            };

            this._tipoEntidadesSvc.fg.patchValue(inputData);

            this._dinamicDialogSvc.open(
              'Editar Tipo de Entidad',
              TipoEntidadesFormComponent
            );
            this._tipoEntidadesSvc.subscription.push(
              this._dinamicDialogSvc.ref.onClose.subscribe(
                (message: string) => {
                  if (message) {
                    this._toastrSvc.success(message, 'Satisfactorio');
                  }
                }
              )
            );
          })
      );
    } catch (err: any) {
      SweetAlert.fire({
        icon: 'error',
        title: 'ERROR',
        text: err,
        showConfirmButton: true,
        confirmButtonText: 'Aceptar',
      });
    }
  }

  private _delete(data: any): void {
    try {
      if (this.hasAdvancedUserPermission()) {
        SweetAlert.fire({
          icon: 'question',
          title: '¿Desea Eliminar el Tipo de Entidad seleccionada?',
          text: 'No se podrán deshacer los cambios.',
          showConfirmButton: true,
          confirmButtonText: 'Sí',
          showCancelButton: true,
          cancelButtonText: 'No',
        }).then(res => {
          if (res.value) {
            const IDsToRemove: number[] = !isArray(data)
              ? [data.Id]
              : data.map(d => {
                  return d.Id;
                });

            this._tipoEntidadesSvc.subscription.push(
              this._tipoEntidadesSvc.delete(IDsToRemove).subscribe(res => {
                const result = res.deleteTipoEntidad;

                if (!result.success) {
                  return SweetAlert.fire({
                    icon: 'error',
                    title: 'ERROR',
                    text: result.error,
                    showConfirmButton: true,
                    confirmButtonText: 'Aceptar',
                  });
                }

                this._toastrSvc.success(
                  'El Tipo de Entidad se ha eliminado correctamente.',
                  'Satisfactorio'
                );
              })
            );
          }
        });
      }
    } catch (err: any) {
      SweetAlert.fire({
        icon: 'error',
        title: 'ERROR',
        text: err,
        showConfirmButton: true,
        confirmButtonText: 'Aceptar',
      });
    }
  }
}

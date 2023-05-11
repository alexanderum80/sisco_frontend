import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from './../../shared/services/authentication.service';
import { DefaultTopLeftButtonsTable } from './../../shared/models/table-buttons';
import { DefaultInlineButtonsTable } from '../../shared/models/table-buttons';
import { IButtons } from './../../shared/ui/prime-ng/button/button.model';
import { ITableColumns } from './../../shared/ui/prime-ng/table/table.model';
import {
  IActionItemClickedArgs,
  ActionClicked,
} from './../../shared/models/list-items';
import { ClasificadorEntidadesFormComponent } from './../clasificador-entidades-form/clasificador-entidades-form.component';
import { ClasificadorEntidadesService } from './../shared/services/clasificador-entidades.service';
import { DinamicDialogService } from './../../shared/ui/prime-ng/dinamic-dialog/dinamic-dialog.service';
import { Component, OnDestroy, AfterViewInit } from '@angular/core';
import { isArray } from 'lodash';
import { SweetalertService } from 'src/app/shared/helpers/sweetalert.service';

@Component({
  selector: 'app-list-clasificador-entidades',
  templateUrl: './list-clasificador-entidades.component.html',
  styleUrls: ['./list-clasificador-entidades.component.scss'],
})
export class ListClasificadorEntidadesComponent
  implements AfterViewInit, OnDestroy
{
  dataSource: any[];

  displayedColumns: ITableColumns[] = [
    { header: 'Unidad', field: 'Unidad', type: 'string' },
    { header: 'División', field: 'Division', type: 'string' },
    { header: 'SubDivisión', field: 'SubDivision', type: 'string' },
    { header: 'Tipo de Entidad', field: 'TipoEntidad', type: 'string' },
  ];

  inlineButtons: IButtons[] = [];
  topLeftButtons: IButtons[] = [];

  loading = true;

  constructor(
    private _authSvc: AuthenticationService,
    private _dinamicDialogSvc: DinamicDialogService,
    private _toastrSvc: ToastrService,
    private _clasificadorEntidadesSvc: ClasificadorEntidadesService,
    private _swalSvc: SweetalertService
  ) {
    if (this.hasAdvancedUserPermission()) {
      this.inlineButtons = DefaultInlineButtonsTable;
      this.topLeftButtons = DefaultTopLeftButtonsTable;
    }
  }

  ngAfterViewInit(): void {
    this._loadAllTipoEntidades();
  }

  private _loadAllTipoEntidades(): void {
    try {
      this._clasificadorEntidadesSvc.subscription.push(
        this._clasificadorEntidadesSvc
          .loadAllClasificadorEntidades()
          .subscribe({
            next: res => {
              this.loading = false;

              this.dataSource = res.getAllClasificadorEntidades;
            },
            error: err => {
              this.loading = false;
              this._swalSvc.error(err);
            },
          })
      );
    } catch (err: any) {
      this.loading = false;

      this._swalSvc.error(err);
    }
  }

  ngOnDestroy(): void {
    this._clasificadorEntidadesSvc.dispose();
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
          idUnidad: null,
          idTipoEntidad: null,
        };
        this._clasificadorEntidadesSvc.fg.patchValue(inputData);

        this._dinamicDialogSvc.open(
          'Agregar Clasificador de Entidad',
          ClasificadorEntidadesFormComponent
        );
        this._clasificadorEntidadesSvc.subscription.push(
          this._dinamicDialogSvc.ref.onClose.subscribe((message: string) => {
            if (message) {
              this._toastrSvc.success(message, 'Satisfactorio');
            }
          })
        );
      }
    } catch (err: any) {
      this._swalSvc.error(err);
    }
  }

  private _edit(clasificadorEntidad: any): void {
    try {
      this._clasificadorEntidadesSvc.subscription.push(
        this._clasificadorEntidadesSvc
          .loadClasificadorEntidad(clasificadorEntidad.IdUnidad)
          .subscribe({
            next: res => {
              const data = res.getClasificadorEntidad;

              const inputData = {
                idUnidad: data.IdUnidad,
                idTipoEntidad: data.IdTipoEntidad,
              };
              this._clasificadorEntidadesSvc.fg.patchValue(inputData);

              this._dinamicDialogSvc.open(
                'Modificar Clasificador de Entidad',
                ClasificadorEntidadesFormComponent
              );
              this._clasificadorEntidadesSvc.subscription.push(
                this._dinamicDialogSvc.ref.onClose.subscribe(
                  (message: string) => {
                    if (message) {
                      this._toastrSvc.success(message, 'Satisfactorio');
                    }
                  }
                )
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

  private _delete(data: any): void {
    try {
      if (this.hasAdvancedUserPermission()) {
        this._swalSvc
          .question(
            'No se podrán deshacer los cambios.',
            '¿Desea Eliminar el Clasificador de Entidad seleccionada?'
          )
          .then(res => {
            if (res === ActionClicked.Yes) {
              const IDsToRemove: number[] = !isArray(data)
                ? [data.Id]
                : data.map(d => {
                    return d.Id;
                  });

              this._clasificadorEntidadesSvc.subscription.push(
                this._clasificadorEntidadesSvc.delete(IDsToRemove).subscribe({
                  next: res => {
                    const result = res.deleteClasificadorEntidad;

                    if (!result.success) {
                      this._swalSvc.error(result.error);
                    }

                    this._toastrSvc.success(
                      'El Clasificador de Entidad se ha eliminado correctamente.',
                      'Satisfactorio'
                    );
                  },
                  error: err => {
                    this._swalSvc.error(err);
                  },
                })
              );
            }
          });
      }
    } catch (err: any) {
      this._swalSvc.error(err);
    }
  }
}

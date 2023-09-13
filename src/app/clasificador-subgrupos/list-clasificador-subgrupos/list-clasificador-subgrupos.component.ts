import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from './../../shared/services/authentication.service';
import { ClasificadorSubgruposFormComponent } from './../clasificador-subgrupos-form/clasificador-subgrupos-form.component';
import {
  ActionClicked,
  IActionItemClickedArgs,
} from './../../shared/models/list-items';
import {
  DefaultInlineButtonsTable,
  DefaultTopLeftButtonsTable,
} from './../../shared/models/table-buttons';
import { ClasificadorSubgruposService } from './../shared/services/clasificador-subgrupos.service';
import { SweetalertService } from './../../shared/helpers/sweetalert.service';

import { DinamicDialogService } from './../../shared/ui/prime-ng/dinamic-dialog/dinamic-dialog.service';
import { IButtons } from './../../shared/ui/prime-ng/button/button.model';
import { ITableColumns } from './../../shared/ui/prime-ng/table/table.model';
import { IActFijosClasificadorSubgrupos } from './../shared/models/clasificador-subgrupos.model';
import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { cloneDeep } from 'lodash';

@Component({
  selector: 'app-list-clasificador-subgrupos',
  templateUrl: './list-clasificador-subgrupos.component.html',
  styleUrls: ['./list-clasificador-subgrupos.component.scss'],
})
export class ListClasificadorSubgruposComponent
  implements AfterViewInit, OnDestroy
{
  clasificadorSubgrupo: IActFijosClasificadorSubgrupos[];

  displayedColumns: ITableColumns[] = [
    { header: 'Grupo', field: 'Grupo', type: 'string', width: '100px' },
    { header: 'Código', field: 'Codigo', type: 'string', width: '200px' },
    {
      header: 'Descripción',
      field: 'Descripcion',
      type: 'string',
    },
    { header: 'Tasa', field: 'Tasa', type: 'number', width: '200px' },
  ];

  inlineButtons: IButtons[] = [];
  topLeftButtons: IButtons[] = [];

  loading = true;

  constructor(
    private _dinamicDialogSvc: DinamicDialogService,
    private _authSvc: AuthenticationService,
    private _swalSvc: SweetalertService,
    private _clasificadorSubgruposSvc: ClasificadorSubgruposService,
    private _toastrSvc: ToastrService
  ) {
    if (this.hasAdvancedUserPermission()) {
      this.inlineButtons = DefaultInlineButtonsTable;
      this.topLeftButtons = DefaultTopLeftButtonsTable;
    }
  }

  ngAfterViewInit(): void {
    this._loadClasificador();
  }

  private _loadClasificador(): void {
    try {
      this._clasificadorSubgruposSvc.subscription.push(
        this._clasificadorSubgruposSvc.loadAll().subscribe({
          next: res => {
            this.loading = false;

            this.clasificadorSubgrupo = cloneDeep(
              res.getAllActFijosClasificadorSubgrupo
            );
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
    this._clasificadorSubgruposSvc.dispose();
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
        this._clasificadorSubgruposSvc.fg.reset();
        this._dinamicDialogSvc.open(
          'Agregar Clasificador de Subgrupos',
          ClasificadorSubgruposFormComponent
        );
        this._clasificadorSubgruposSvc.subscription.push(
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

  private _edit(clasificador: { Grupo: number; Codigo: number }): void {
    try {
      if (this.hasAdvancedUserPermission()) {
        this._clasificadorSubgruposSvc.subscription.push(
          this._clasificadorSubgruposSvc
            .loadOne(clasificador.Grupo, clasificador.Codigo)
            .subscribe({
              next: res => {
                const data = res.getActFijosClasificadorSubgrupo;

                const inputData = {
                  grupo: data.Grupo,
                  codigo: data.Codigo,
                  descripcion: data.Descripcion,
                  tasa: data.Tasa,
                };

                this._clasificadorSubgruposSvc.fg.patchValue(inputData);
                this._dinamicDialogSvc.open(
                  'Modificar Clasificador de Subgrupos',
                  ClasificadorSubgruposFormComponent
                );
                this._clasificadorSubgruposSvc.subscription.push(
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
      }
    } catch (err: any) {
      this._swalSvc.error(err);
    }
  }

  private _delete(clasificador: IActFijosClasificadorSubgrupos): void {
    try {
      if (this.hasAdvancedUserPermission()) {
        this._swalSvc
          .question('¿Desea Eliminar el Subgrupo seleccionado?')
          .then(res => {
            if (res === ActionClicked.Yes) {
              this._clasificadorSubgruposSvc.subscription.push(
                this._clasificadorSubgruposSvc
                  .delete(clasificador.Grupo, clasificador.Codigo)
                  .subscribe({
                    next: () => {
                      this._toastrSvc.success(
                        'El Subgrupo se ha eliminado correctamente.',
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

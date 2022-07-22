import { DefaultTopLeftButtonsTable } from './../../shared/models/table-buttons';
import { cloneDeep } from 'lodash';
import { DefaultInlineButtonsTable } from '../../shared/models/table-buttons';
import { IButtons } from './../../shared/ui/prime-ng/button/button.model';
import { ClasificadorCnmbFormComponent } from './../clasificador-cnmb-form/clasificador-cnmb-form.component';
import {
  IActionItemClickedArgs,
  ActionClicked,
} from './../../shared/models/list-items';
import { MessageService } from 'primeng/api';
import { ClasificadorCnmbService } from './../shared/services/clasificador-cnmb.service';
import { SweetalertService } from './../../shared/services/sweetalert.service';
import { UsuarioService } from 'src/app/shared/services/usuario.service';
import { DinamicDialogService } from './../../shared/ui/prime-ng/dinamic-dialog/dinamic-dialog.service';
import { ITableColumns } from './../../shared/ui/prime-ng/table/table.model';
import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { IActFijosClasificadorCnmb } from '../shared/models/clasificador-cnmb.model';

@Component({
  selector: 'app-list-clasificador-cnmb',
  templateUrl: './list-clasificador-cnmb.component.html',
  styleUrls: ['./list-clasificador-cnmb.component.scss'],
})
export class ListClasificadorCnmbComponent implements AfterViewInit, OnDestroy {
  clasificadorCNMB: IActFijosClasificadorCnmb[];

  displayedColumns: ITableColumns[] = [
    { header: 'CNMB', field: 'CNMB', type: 'string' },
    {
      header: 'Descripción',
      field: 'DCNMB',
      type: 'string',
    },
    { header: 'Tasa', field: 'TREPO', type: 'number' },
  ];

  inlineButtons: IButtons[] = [];
  topLeftButtons: IButtons[] = [];

  loading = true;

  constructor(
    private _dinamicDialogSvc: DinamicDialogService,
    private _usuarioSvc: UsuarioService,
    private _sweetalertSvc: SweetalertService,
    private _clasificadorCnmbSvc: ClasificadorCnmbService,
    private _msgSvc: MessageService
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
      this._clasificadorCnmbSvc.subscription.push(
        this._clasificadorCnmbSvc.loadAll().subscribe({
          next: response => {
            this.loading = false;

            this.clasificadorCNMB = cloneDeep(
              response.getAllActFijosClasificadorCnmb
            );
          },
          error: err => {
            this.loading = false;
            this._sweetalertSvc.error(err);
          },
        })
      );
    } catch (err: any) {
      this.loading = false;
      this._sweetalertSvc.error(err);
    }
  }

  ngOnDestroy(): void {
    this._clasificadorCnmbSvc.dispose();
  }

  hasAdvancedUserPermission(): boolean {
    return this._usuarioSvc.hasAdvancedUserPermission();
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
        this._clasificadorCnmbSvc.fg.reset();
        this._dinamicDialogSvc.open(
          'Agregar Clasificador CNMB',
          ClasificadorCnmbFormComponent
        );
        this._clasificadorCnmbSvc.subscription.push(
          this._dinamicDialogSvc.ref.onClose.subscribe((message: string) => {
            if (message) {
              this._msgSvc.add({
                severity: 'success',
                summary: 'Satisfactorio',
                detail: message,
              });
            }
          })
        );
      }
    } catch (err: any) {
      this._sweetalertSvc.error(err);
    }
  }

  private _edit(clasificador: { CNMB: number }): void {
    try {
      if (this.hasAdvancedUserPermission()) {
        this._clasificadorCnmbSvc.subscription.push(
          this._clasificadorCnmbSvc.loadOne(clasificador.CNMB).subscribe({
            next: response => {
              const data = response.getActFijosClasificadorCnmb;

              const inputData = {
                cnmb: data.CNMB,
                descripcion: data.DCNMB,
                tasa: data.TREPO,
              };

              this._clasificadorCnmbSvc.fg.patchValue(inputData);
              this._dinamicDialogSvc.open(
                'Modificar Clasificador CNMB',
                ClasificadorCnmbFormComponent
              );
              this._clasificadorCnmbSvc.subscription.push(
                this._dinamicDialogSvc.ref.onClose.subscribe(
                  (message: string) => {
                    if (message) {
                      this._msgSvc.add({
                        severity: 'success',
                        summary: 'Satisfactorio',
                        detail: message,
                      });
                    }
                  }
                )
              );
            },
            error: err => {
              this._sweetalertSvc.error(err);
            },
          })
        );
      }
    } catch (err: any) {
      this._sweetalertSvc.error(err);
    }
  }

  private _delete(clasificador: any): void {
    try {
      if (this.hasAdvancedUserPermission()) {
        this._sweetalertSvc
          .question('¿Desea Eliminar el CNMB seleccionado?')
          .then(res => {
            if (res === ActionClicked.Yes) {
              this._clasificadorCnmbSvc.subscription.push(
                this._clasificadorCnmbSvc.delete(clasificador).subscribe({
                  next: () => {
                    this._msgSvc.add({
                      severity: 'success',
                      summary: 'Satisfactorio',
                      detail: 'El CNMB se ha eliminado correctamente.',
                    });
                  },
                  error: err => {
                    this._sweetalertSvc.error(err);
                  },
                })
              );
            }
          });
      }
    } catch (err: any) {
      this._sweetalertSvc.error(err);
    }
  }
}

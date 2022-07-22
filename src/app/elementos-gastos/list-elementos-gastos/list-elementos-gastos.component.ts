import { DefaultTopLeftButtonsTable } from './../../shared/models/table-buttons';
import { DefaultInlineButtonsTable } from '../../shared/models/table-buttons';
import { IButtons } from './../../shared/ui/prime-ng/button/button.model';
import {
  IActionItemClickedArgs,
  ActionClicked,
} from './../../shared/models/list-items';
import { ITableColumns } from './../../shared/ui/prime-ng/table/table.model';
import SweetAlert from 'sweetalert2';
import { ElementosGastosFormComponent } from './../elementos-gastos-form/elementos-gastos-form.component';
import { ElementosGastosService } from './../shared/services/elementos-gastos.service';
import { UsuarioService } from './../../shared/services/usuario.service';
import { DinamicDialogService } from './../../shared/ui/prime-ng/dinamic-dialog/dinamic-dialog.service';
import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { MessageService } from 'primeng/api';
import { isArray } from 'lodash';

@Component({
  selector: 'app-list-elementos-gastos',
  templateUrl: './list-elementos-gastos.component.html',
  styleUrls: ['./list-elementos-gastos.component.scss'],
})
export class ListElementosGastosComponent implements AfterViewInit, OnDestroy {
  elementosGastos: any[];

  displayedColumns: ITableColumns[] = [
    { header: 'Elemento', field: 'Egasto', type: 'string' },
    { header: 'Descripción', field: 'Descripcion', type: 'string' },
    { header: 'Uso y Contenido', field: 'UsoContenido', type: 'string' },
  ];

  inlineButtons: IButtons[] = [];
  topLeftButtons: IButtons[] = [];

  constructor(
    private _dinamicDialogSvc: DinamicDialogService,
    private _msgSvc: MessageService,
    private _usuarioSvc: UsuarioService,
    private _elementosGastosSvc: ElementosGastosService
  ) {
    if (this.hasAdvancedUserPermission()) {
      this.inlineButtons = DefaultInlineButtonsTable;
      this.topLeftButtons = DefaultTopLeftButtonsTable;
    }
  }

  ngAfterViewInit(): void {
    this._loadElementosGastos();
  }

  ngOnDestroy(): void {
    this._elementosGastosSvc.dispose();
  }

  private _loadElementosGastos(): void {
    this._elementosGastosSvc.loadAllElementosGastos().subscribe(response => {
      const result = response.getAllElementosGastos;

      if (!result.success) {
        return SweetAlert.fire({
          icon: 'error',
          title: 'ERROR',
          text: `Ocurrió el siguiente error: ${result.error}`,
          showConfirmButton: true,
          confirmButtonText: 'Aceptar',
        });
      }

      this.elementosGastos = result.data;
    });
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
        const inputData = {
          elemento: '',
          descripcion: '',
          usoContenido: '',
          tipoEntidad: '',
          cuentaAsociada: '',
          epigrafe: '',
        };
        this._elementosGastosSvc.fg.patchValue(inputData);

        this._dinamicDialogSvc.open(
          'Agregar Elemento de Gasto',
          ElementosGastosFormComponent
        );
        this._elementosGastosSvc.subscription.push(
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
      SweetAlert.fire({
        icon: 'error',
        title: 'ERROR',
        text: `Ocurrió el siguiente error: ${err}`,
        showConfirmButton: true,
        confirmButtonText: 'Aceptar',
      });
    }
  }

  private _edit(data: any): void {
    this._elementosGastosSvc.subscription.push(
      this._elementosGastosSvc
        .loadElementoGastoById(data.Egasto)
        .subscribe(response => {
          const result = response.getElementoGastoById;
          if (!result.success) {
            return SweetAlert.fire({
              icon: 'error',
              title: 'ERROR',
              text: `Se produjo el siguiente error: ${result.error}`,
              showConfirmButton: true,
              confirmButtonText: 'Aceptar',
            });
          }

          const data = result.data;

          const inputData = {
            elemento: data.Egasto,
            descripcion: data.Descripcion,
            usoContenido: data.UsoContenido,
            tipoEntidad: data.TipoEntidad.split(', ').map(Number),
            cuentaAsociada: data.CuentaAsociada.trimEnd().split(', '),
            epigrafe: data.IdEpigrafe,
          };

          this._elementosGastosSvc.fg.patchValue(inputData);

          this._dinamicDialogSvc.open(
            'Modificar Elemento de Gasto',
            ElementosGastosFormComponent
          );
          this._elementosGastosSvc.subscription.push(
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
        })
    );
  }

  private _delete(data: any): void {
    try {
      if (this.hasAdvancedUserPermission()) {
        SweetAlert.fire({
          icon: 'question',
          title: '¿Desea Eliminar el Elemento de Gasto seleccionado?',
          text: 'No se podrán deshacer los cambios.',
          showConfirmButton: true,
          confirmButtonText: 'Sí',
          showCancelButton: true,
          cancelButtonText: 'No',
        }).then(res => {
          if (res.value) {
            const IDsToRemove: number[] = !isArray(data)
              ? [data.Egasto]
              : data.map(d => {
                  return d.Egasto;
                });

            this._elementosGastosSvc.subscription.push(
              this._elementosGastosSvc
                .delete(IDsToRemove)
                .subscribe(response => {
                  const result = response.deleteElementoGasto;

                  if (result.success === false) {
                    return SweetAlert.fire({
                      icon: 'error',
                      title: 'ERROR',
                      text: `Ocurrió el siguiente error: ${result.error}`,
                      showConfirmButton: true,
                      confirmButtonText: 'Aceptar',
                    });
                  }

                  this._msgSvc.add({
                    severity: 'success',
                    summary: 'Satisfactorio',
                    detail:
                      'El Elemento de Gasto se ha eliminado correctamente.',
                  });
                })
            );
          }
        });
      }
    } catch (err: any) {
      SweetAlert.fire({
        icon: 'error',
        title: 'ERROR',
        text: `Ocurrió el siguiente error: ${err}`,
        showConfirmButton: true,
        confirmButtonText: 'Aceptar',
      });
    }
  }
}

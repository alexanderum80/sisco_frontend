import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from './../../shared/services/authentication.service';
import { DefaultTopLeftButtonsTable } from './../../shared/models/table-buttons';
import { DefaultInlineButtonsTable } from '../../shared/models/table-buttons';
import { IButtons } from './../../shared/ui/prime-ng/button/button.model';
import {
  IActionItemClickedArgs,
  ActionClicked,
} from './../../shared/models/list-items';
import { ITableColumns } from './../../shared/ui/prime-ng/table/table.model';
import { ElementosGastosFormComponent } from './../elementos-gastos-form/elementos-gastos-form.component';
import { ElementosGastosService } from './../shared/services/elementos-gastos.service';
import { DinamicDialogService } from './../../shared/ui/prime-ng/dinamic-dialog/dinamic-dialog.service';
import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { cloneDeep, isArray } from 'lodash';
import { SweetalertService } from 'src/app/shared/helpers/sweetalert.service';

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

  loading = true;

  constructor(
    private _authSvc: AuthenticationService,
    private _dinamicDialogSvc: DinamicDialogService,
    private _toastrSvc: ToastrService,
    private _elementosGastosSvc: ElementosGastosService,
    private _swalSvc: SweetalertService
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
    this._elementosGastosSvc.loadAllElementosGastos().subscribe({
      next: res => {
        this.loading = false;

        this.elementosGastos = cloneDeep(res.getAllElementosGastos);
      },
      error: err => {
        this.loading = false;
        this._swalSvc.error(err);
      },
    });
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
              this._toastrSvc.success(message, 'Satisfactorio');
            }
          })
        );
      }
    } catch (err: any) {
      this._swalSvc.error(err);
    }
  }

  private _edit(data: any): void {
    this._elementosGastosSvc.subscription.push(
      this._elementosGastosSvc.loadElementoGastoById(data.Egasto).subscribe({
        next: res => {
          const result = res.getElementoGastoById;

          const inputData = {
            elemento: result.Egasto,
            descripcion: result.Descripcion,
            usoContenido: result.UsoContenido,
            tipoEntidad: result.TipoEntidad.split(', ').map(Number),
            cuentaAsociada: result.CuentaAsociada.trimEnd().split(', '),
            epigrafe: result.IdEpigrafe,
          };

          this._elementosGastosSvc.fg.patchValue(inputData);

          this._dinamicDialogSvc.open(
            'Modificar Elemento de Gasto',
            ElementosGastosFormComponent
          );
          this._elementosGastosSvc.subscription.push(
            this._dinamicDialogSvc.ref.onClose.subscribe((message: string) => {
              if (message) {
                this._toastrSvc.success(message, 'Satisfactorio');
              }
            })
          );
        },
        error: err => {
          this._swalSvc.error(err);
        },
      })
    );
  }

  private _delete(data: any): void {
    try {
      if (this.hasAdvancedUserPermission()) {
        this._swalSvc
          .question(
            'No se podrán deshacer los cambios.',
            '¿Desea Eliminar el Elemento de Gasto seleccionado?'
          )
          .then(res => {
            if (res === ActionClicked.Yes) {
              const IDsToRemove: number[] = !isArray(data)
                ? [data.Egasto]
                : data.map(d => {
                    return d.Egasto;
                  });

              this._elementosGastosSvc.subscription.push(
                this._elementosGastosSvc.delete(IDsToRemove).subscribe(res => {
                  const result = res.deleteElementoGasto;

                  if (result.success === false) {
                    return this._swalSvc.error(result.error);
                  }

                  this._toastrSvc.success(
                    'El Elemento de Gasto se ha eliminado correctamente.',
                    'Satisfactorio'
                  );
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

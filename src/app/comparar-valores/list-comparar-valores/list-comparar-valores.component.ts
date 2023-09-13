import { ToastrService } from 'ngx-toastr';
import { DefaultTopLeftButtonsTable } from './../../shared/models/table-buttons';
import { DefaultInlineButtonsTable } from '../../shared/models/table-buttons';
import { IButtons } from './../../shared/ui/prime-ng/button/button.model';
import { SweetalertService } from './../../shared/helpers/sweetalert.service';
import { CompararValoresFormComponent } from './../comparar-valores-form/comparar-valores-form.component';
import { DinamicDialogService } from './../../shared/ui/prime-ng/dinamic-dialog/dinamic-dialog.service';
import { CompararValoresService } from './../shared/services/comparar-valores.service';
import {
  IActionItemClickedArgs,
  ActionClicked,
} from './../../shared/models/list-items';
import { ITableColumns } from './../../shared/ui/prime-ng/table/table.model';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { cloneDeep, isArray } from 'lodash';

@Component({
  selector: 'app-list-comparar-valores',
  templateUrl: './list-comparar-valores.component.html',
  styleUrls: ['./list-comparar-valores.component.scss'],
})
export class ListCompararValoresComponent implements OnInit, OnDestroy {
  columns: ITableColumns[] = [
    { header: 'Expresión', field: 'Expresion', type: 'string' },
    { header: 'Centro', field: 'Centro', type: 'string' },
    { header: 'Consolidado', field: 'Consolidado', type: 'boolean' },
    { header: 'Operador', field: 'Operador', type: 'string' },
    { header: 'Valor', field: 'Valor', type: 'decimal' },
    { header: 'Activo', field: 'Activo', type: 'boolean' },
  ];

  compararValores: any[] = [];

  inlineButtons: IButtons[] = DefaultInlineButtonsTable;
  topLeftButtons: IButtons[] = DefaultTopLeftButtonsTable;

  loading = true;

  constructor(
    private _compararValoresSvc: CompararValoresService,
    private _dinamicDialogSvc: DinamicDialogService,
    private _toastrSvc: ToastrService,
    private _swalSvc: SweetalertService
  ) {}

  ngOnInit(): void {
    this._getCompararValores();
  }

  ngOnDestroy(): void {
    this._compararValoresSvc.dispose();
  }

  private _getCompararValores(): void {
    try {
      this._compararValoresSvc.subscription.push(
        this._compararValoresSvc.loadAll().subscribe({
          next: res => {
            this.loading = false;

            this.compararValores = cloneDeep(res.getAllComprobarValores);
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
      this._compararValoresSvc.fg.reset();

      this._dinamicDialogSvc.open(
        'Agregar Comparación de Valores',
        CompararValoresFormComponent,
        '400px'
      );
      this._compararValoresSvc.subscription.push(
        this._dinamicDialogSvc.ref.onClose.subscribe((message: string) => {
          if (message) {
            this._toastrSvc.success(message, 'Satisfactorio');
          }
        })
      );
    } catch (err: any) {
      this._swalSvc.error(err);
    }
  }

  private _edit(data: any): void {
    try {
      this._compararValoresSvc.fg.reset();
      this._compararValoresSvc.subscription.push(
        this._compararValoresSvc.loadOne(data.Id).subscribe({
          next: res => {
            const result = res.getComprobarValorById;

            const inputValue = {
              id: result.Id,
              centro: result.IdCentro,
              expresion: result.IdExpresion,
              operador: result.IdOperador,
              valor: result.Valor,
              division: result.IdDivision,
              consolidado: result.Consolidado,
              activo: result.Activo,
            };

            this._compararValoresSvc.fg.patchValue(inputValue);

            this._dinamicDialogSvc.open(
              'Editar Comparación de Valores',
              CompararValoresFormComponent,
              '400px'
            );
            this._compararValoresSvc.subscription.push(
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
      this._swalSvc
        .question('¿Desea Eliminar la(s) Comparación(es) seleccionada(s)?')
        .then(res => {
          if (res === ActionClicked.Yes) {
            data = isArray(data) ? data : [data];

            const IDsToRemove: number[] = data.map((d: { Id: number }) => {
              return d.Id;
            });

            this._compararValoresSvc.subscription.push(
              this._compararValoresSvc.delete(IDsToRemove).subscribe(res => {
                const result = res.deleteComprobarValor;

                if (!result.success) {
                  return this._swalSvc.error(result.error);
                }

                this._toastrSvc.success(
                  'La Comparación se ha eliminado Satisfactoriamente.',
                  'Satisfactorio'
                );
              })
            );
          }
        });
    } catch (err: any) {
      this._swalSvc.error(err);
    }
  }
}

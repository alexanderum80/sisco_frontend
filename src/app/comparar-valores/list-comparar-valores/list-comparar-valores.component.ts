import { DefaultTopLeftButtonsTable } from './../../shared/models/table-buttons';
import { DefaultInlineButtonsTable } from '../../shared/models/table-buttons';
import { IButtons } from './../../shared/ui/prime-ng/button/button.model';
import { SweetalertService } from './../../shared/services/sweetalert.service';
import { MessageService } from 'primeng/api';
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
    { header: 'Operador', field: 'Operador', type: 'string' },
    { header: 'Valor', field: 'Valor', type: 'decimal' },
  ];

  compararValores: any[] = [];

  inlineButtons: IButtons[] = DefaultInlineButtonsTable;
  topLeftButtons: IButtons[] = DefaultTopLeftButtonsTable;

  constructor(
    private _compararValoresSvc: CompararValoresService,
    private _dinamicDialogSvc: DinamicDialogService,
    private _msgSvc: MessageService,
    private _sweetAlertSvc: SweetalertService
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
        this._compararValoresSvc.loadAll().subscribe(response => {
          const result = response.getAllComprobarValores;

          if (result.success === false) {
            return this._sweetAlertSvc.error(
              `Ocurrió el siguiente error: ${result.error}`
            );
          }

          this.compararValores = cloneDeep(result.data);
        })
      );
    } catch (err: any) {
      this._sweetAlertSvc.error(`Ocurrió el siguiente error: ${err}`);
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
      this._compararValoresSvc.inicializarFg();

      this._dinamicDialogSvc.open(
        'Agregar Comparación de Valores',
        CompararValoresFormComponent
      );
      this._compararValoresSvc.subscription.push(
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
    } catch (err: any) {
      this._sweetAlertSvc.error(`Ocurrió el siguiente error: ${err}`);
    }
  }

  private _edit(data: any): void {
    try {
      this._compararValoresSvc.inicializarFg();
      this._compararValoresSvc.subscription.push(
        this._compararValoresSvc.loadOne(data.Id).subscribe(response => {
          const result = response.getComprobarValorById;

          if (!result.success) {
            throw new Error(result.error);
          }

          const inputValue = {
            id: result.data.Id,
            centro: result.data.IdCentro,
            expresion: result.data.IdExpresion,
            operador: result.data.IdOperador,
            valor: result.data.Valor,
            division: result.data.IdDivision,
          };

          this._compararValoresSvc.fg.patchValue(inputValue);

          this._dinamicDialogSvc.open(
            'Editar Comparación de Valores',
            CompararValoresFormComponent
          );
          this._compararValoresSvc.subscription.push(
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
    } catch (err: any) {
      this._sweetAlertSvc.error(`Ocurrió el siguiente error: ${err}`);
    }
  }

  private _delete(data: any): void {
    try {
      this._sweetAlertSvc
        .question('¿Desea Eliminar la(s) Comparación(es) seleccionada(s)?')
        .then(res => {
          if (res === ActionClicked.Yes) {
            data = isArray(data) ? data : [data];

            const IDsToRemove: number[] = data.map((d: { Id: number }) => {
              return d.Id;
            });

            this._compararValoresSvc.subscription.push(
              this._compararValoresSvc
                .delete(IDsToRemove)
                .subscribe(response => {
                  const result = response.deleteComprobarValor;

                  if (!result.success) {
                    throw new Error(result.error);
                  }

                  this._msgSvc.add({
                    severity: 'success',
                    summary: 'Satisfactorio',
                    detail:
                      'La Comparación se ha eliminado Satisfactoriamente.',
                  });
                })
            );
          }
        });
    } catch (err: any) {
      this._sweetAlertSvc.error(`Ocurrió el siguiente error: ${err}`);
    }
  }
}

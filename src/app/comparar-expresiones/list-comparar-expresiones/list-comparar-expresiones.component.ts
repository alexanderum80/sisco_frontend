import { ActionClicked, IActionItemClickedArgs } from './../../shared/models/list-items';
import { DinamicDialogService } from './../../shared/ui/prime-ng/dinamic-dialog/dinamic-dialog.service';
import { SweetalertService } from './../../shared/services/sweetalert.service';
import { MessageService } from 'primeng/api';
import { ITableColumns } from './../../shared/ui/prime-ng/table/table.model';
import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CompararExpresionesService } from '../shared/services/comparar-expresiones.service';
import { cloneDeep } from '@apollo/client/utilities';
import { CompararExpresionesFormComponent } from '../comparar-expresiones-form/comparar-expresiones-form.component';
import { isArray } from 'lodash';

@Component({
  selector: 'app-list-comparar-expresiones',
  templateUrl: './list-comparar-expresiones.component.html',
  styleUrls: ['./list-comparar-expresiones.component.scss']
})
export class ListCompararExpresionesComponent implements OnInit, AfterViewInit, OnDestroy {

  columns: ITableColumns[] = [
    { header: 'Expresión', field: 'Expresion.Expresion', type: 'string' },
    { header: 'Operador', field: 'Operador.Operador', type: 'string' },
    { header: 'Expresión', field: 'ExpresionC.Expresion', type: 'string' },
    { header: 'Centro', field: 'Centro', type: 'boolean' },
    { header: 'Complejo', field: 'Complejo', type: 'boolean' },
    { header: 'Consolidado', field: 'Con', type: 'boolean' },
  ];

  compararExpresiones: any[] = [];

  subscription: Subscription[] = [];

  constructor(
    private _compararExpresionesSvc: CompararExpresionesService,
    private _dinamicDialogSvc: DinamicDialogService,
    private _sweetAlertSvc: SweetalertService,
    private _msgSvc: MessageService,
  ) { }

  ngOnInit(): void {
  }
  
  ngAfterViewInit(): void {
    this._getCompararExpresiones();
  }

  ngOnDestroy(): void {
    this.subscription.forEach(subs => subs.unsubscribe());
    this.compararExpresiones = [];
  }

  private _getCompararExpresiones(): void {
    try {
      this.subscription.push(this._compararExpresionesSvc.loadAll().subscribe(response => {
        const result = response.getAllComprobarExpresiones;

        if (result.success === false) {
          return this._sweetAlertSvc.error(`Ocurrió el siguiente error: ${ result.error }`);
        }

        this.compararExpresiones = cloneDeep(result.data);
      }));
    } catch (err: any) {
      this._sweetAlertSvc.error(`Ocurrió el siguiente error: ${ err }`);
    }
  }

  actionClicked(event: IActionItemClickedArgs) {
    switch (event.action) {
      case ActionClicked.Add:
        this._add();
        break;
      case ActionClicked.Edit:
        this._edit(event.item)
        break;    
      case ActionClicked.Delete:
        this._delete(event.item)
        break;
    }
  }

  private _add(): void {
    try {
      this._compararExpresionesSvc.inicializarFg();

      this._dinamicDialogSvc.open('Agregar Comparación de Expresión', CompararExpresionesFormComponent);
      this._dinamicDialogSvc.ref.onClose.subscribe((message: string) => {
        if (message) {
          this._msgSvc.add({ severity: 'success', summary: 'Satisfactorio', detail: message })
        }
      });
    } catch (err: any) {
      this._sweetAlertSvc.error(`Ocurrió el siguiente error: ${ err }`);
    }
  }

  private _edit(data: any): void {
    try {
      this._compararExpresionesSvc.inicializarFg();
      this._compararExpresionesSvc.loadOne(data.Id).subscribe(response => {
        const result = response.getComprobarExpresionById;

        if (!result.success) {
          throw new Error(result.error);
        }

        const inputValue = {
          id: result.data.Id,
          expresion:  result.data.IdExpresion,
          operador: result.data.IdOperador,
          expresionC: result.data.IdExpresionC,
          centro: result.data.Centro,
          complejo: result.data.Complejo,
          consolidado: result.data.Con,
        };

        this._compararExpresionesSvc.fg.patchValue(inputValue);

        this._dinamicDialogSvc.open('Editar Comparación de Expresión', CompararExpresionesFormComponent);
        this._dinamicDialogSvc.ref.onClose.subscribe((message: string) => {
          if (message) {
            this._msgSvc.add({ severity: 'success', summary: 'Satisfactorio', detail: message })
          }
        });
      });
    } catch (err: any) {
      this._sweetAlertSvc.error(`Ocurrió el siguiente error: ${ err }`);
    }
  }

  private _delete(data: any): void {
    try {
      this._sweetAlertSvc.question('¿Desea Eliminar la(s) Comparación(es) seleccionada(s)?').then(res => {
        if (res === ActionClicked.Yes) {
          const IDsToRemove: number[] = !isArray(data) ? [data.Id] :  data.map(d => { return d.Id });

          this._compararExpresionesSvc.delete(IDsToRemove).subscribe(response => {
            const result = response.deleteComprobarExpresion;

            if (!result.success) {
              throw new Error(result.error);
            }

            this._msgSvc.add({ severity: 'success', summary: 'Satisfactorio', detail: 'La comparación se ha eliminado Satisfactoriamente.' })
          });
        }
      });
    } catch (err: any) {
      this._sweetAlertSvc.error(`Ocurrió el siguiente error: ${ err }`);
    }
  }

}

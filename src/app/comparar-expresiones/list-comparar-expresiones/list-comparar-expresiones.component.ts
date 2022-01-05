import { ActionClicked } from './../../shared/models/list-items';
import { DinamicDialogService } from './../../shared/ui/prime-ng/dinamic-dialog/dinamic-dialog.service';
import { SweetalertService } from './../../shared/services/sweetalert.service';
import { MenuItem } from 'primeng/api';
import { ITableColumns } from './../../shared/ui/prime-ng/table/table.model';
import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CompararExpresionesService } from '../shared/services/comparar-expresiones.service';
import { cloneDeep } from '@apollo/client/utilities';
import { CompararExpresionesFormComponent } from '../comparar-expresiones-form/comparar-expresiones-form.component';

@Component({
  selector: 'app-list-comparar-expresiones',
  templateUrl: './list-comparar-expresiones.component.html',
  styleUrls: ['./list-comparar-expresiones.component.scss']
})
export class ListCompararExpresionesComponent implements OnInit, AfterViewInit, OnDestroy {
  columns: ITableColumns[] = [
    { header: 'Expresión', field: 'ExpresionDesc', type: 'string' },
    { header: 'Operador', field: 'OperadorDesc', type: 'string' },
    { header: 'Expresión', field: 'ExpresionDesc_C', type: 'string' },
    { header: 'Centro', field: 'Centro', type: 'boolean' },
    { header: 'Complejo', field: 'Complejo', type: 'boolean' },
    { header: 'Consolidado', field: 'Con', type: 'boolean' },
  ];

  compararExpresiones: any[] = [];

  subscription: Subscription[] = [];

  menuItems: MenuItem[] = [
    { id: '0', label: 'Editar', icon: 'mdi mdi-pencil', disabled: false, command: (event) => {
      this.edit(event);
    }},
    { id: '1', label: 'Eliminar', icon: 'mdi mdi-delete-outline', disabled: false, command: (event) => {
      this.delete(event);
    }},
  ];

  constructor(
    private _compararExpresionesSvc: CompararExpresionesService,
    private _dinamicDialogSvc: DinamicDialogService,
    private _sweetAlertSvc: SweetalertService
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
      this.subscription.push(this._compararExpresionesSvc.loadAllCompararExpresiones().subscribe(response => {
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

  add(): void {
    try {
      this._compararExpresionesSvc.inicializarFg();
      this._dinamicDialogSvc.open(CompararExpresionesFormComponent, 'Agregar Comparación de Expresión');
    } catch (err: any) {
      this._sweetAlertSvc.error(`Ocurrió el siguiente error: ${ err }`);
    }
  }

  edit(menu: any): void {
    try {
      this._compararExpresionesSvc.inicializarFg();
      this._compararExpresionesSvc.loadCompararExpresion(menu.item.automationId.Id).subscribe(response => {
        const result = response.getComprobarExpresionById;

        if (!result.success) {
          throw new Error(result.error);
        }

        const inputValue = {
          id: result.data.Id,
          expresion:  result.data.Expresion,
          operador: result.data.Operador,
          expresionC: result.data.ExpresionC,
          centro: result.data.Centro,
          complejo: result.data.Complejo,
          consolidado: result.data.Con,
        };

        this._compararExpresionesSvc.fg.patchValue(inputValue);

        this._dinamicDialogSvc.open(CompararExpresionesFormComponent, 'Editar Comparación de Expresión');
      });
    } catch (err: any) {
      this._sweetAlertSvc.error(`Ocurrió el siguiente error: ${ err }`);
    }
  }

  delete(menu: any): void {
    try {
      this._sweetAlertSvc.question('¿Desea Eliminar la Comparación seleccionada?').then(res => {
        if (res === ActionClicked.Yes) {
          this._compararExpresionesSvc.deleteCompararExpresion(menu.item.automationId.Id).subscribe(response => {
            const result = response.deleteComprobarExpresion;

            if (!result.success) {
              throw new Error(result.error);
            }
            this._sweetAlertSvc.success('La comparación se ha eliminado Satisfactoriamente.');
          });
        }
      });
    } catch (err: any) {
      this._sweetAlertSvc.error(`Ocurrió el siguiente error: ${ err }`);
    }
  }

}

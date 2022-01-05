import { MenuItem } from 'primeng/api';
import { ActionClicked } from './../../shared/models/list-items';
import { SweetalertService } from './../../shared/services/sweetalert.service';
import { Component, OnDestroy, OnInit, AfterViewInit } from '@angular/core';
import { cloneDeep } from '@apollo/client/utilities';
import { Subscription } from 'rxjs';
import { ITableColumns } from '../../shared/ui/prime-ng/table/table.model';
import { ExpresionesFormComponent } from '../expresiones-form/expresiones-form.component';
import { ExpresionesService } from '../shared/services/expresiones.service';
import { DinamicDialogService } from '../../shared/ui/prime-ng/dinamic-dialog/dinamic-dialog.service';

@Component({
  selector: 'app-list-expresiones',
  templateUrl: './list-expresiones.component.html',
  styleUrls: ['./list-expresiones.component.scss']
})
export class ListExpresionesComponent implements OnInit, AfterViewInit, OnDestroy {
  columns: ITableColumns[] = [
    { header: 'Expresión', field: 'Expresion', type: 'string' },
    { header: 'Descripción', field: 'Descripcion', type: 'string' },
    { header: 'Acumulado', field: 'Acumulado', type: 'boolean' },
    { header: 'Operaciones Internas', field: 'OperacionesInternas', type: 'boolean' },
  ];

  expresiones: any[] = [];

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
    private _expresionesSvc: ExpresionesService,
    private _dinamicDialogSvc: DinamicDialogService,
    private _sweetAlertSvc: SweetalertService
  ) { }

  ngOnInit(): void {
  }
  
  ngAfterViewInit(): void {
    this._getExpresionesResumen();
  }

  ngOnDestroy(): void {
    this.subscription.forEach(subs => subs.unsubscribe());
    this.expresiones = [];
  }

  private _getExpresionesResumen(): void {
    try {
      this.subscription.push(this._expresionesSvc.loadAllExpresionesResumen().subscribe(response => {
        const result = response.getAllExpresionesResumen;

        if (result.success === false) {
          return this._sweetAlertSvc.error(`Ocurrió el siguiente error: ${ result.error }`);
        }

        this.expresiones = cloneDeep(result.data);
      }));
    } catch (err: any) {
      this._sweetAlertSvc.error(`Ocurrió el siguiente error: ${ err }`);
    }
  }

  add(): void {
    try {
      this._expresionesSvc.inicializarFg();
      this._dinamicDialogSvc.open(ExpresionesFormComponent, 'Agregar Expresión');
    } catch (err: any) {
      this._sweetAlertSvc.error(`Ocurrió el siguiente error: ${ err }`);
    }
  }

  edit(menu: any): void {
    try {
      this._expresionesSvc.inicializarFg();
      this._expresionesSvc.loadExpresionResumenById(menu.item.automationId.IdExpresion).subscribe(response => {
        const result = response.getExpresionResumenById;

        if (!result.success) {
          throw new Error(result.error);
        }

        const inputValue = {
          idExpresion: result.data.IdExpresion,
          expresion: result.data.Expresion,
          descripcion: result.data.Descripcion,
          acumulado: result.data.Acumulado,
          operacionesInternas: result.data.OperacionesInternas,
        };

        this._expresionesSvc.fg.patchValue(inputValue);

        this._dinamicDialogSvc.open(ExpresionesFormComponent, 'Editar Expresión');
      });
    } catch (err: any) {
      this._sweetAlertSvc.error(`Ocurrió el siguiente error: ${ err }`);
    }
  }

  delete(menu: any): void {
    try {
      this._sweetAlertSvc.question('¿Desea Eliminar la Expresión seleccionada?').then(res => {
        if (res === ActionClicked.Yes) {
          this._expresionesSvc.deleteExpresionResumen(menu.item.automationId.IdExpresion).subscribe(response => {
            const result = response.deleteExpresionResumen;

            if (!result.success) {
              throw new Error(result.error);
            }
          });
        }
      });
    } catch (err: any) {
      this._sweetAlertSvc.error(`Ocurrió el siguiente error: ${ err }`);
    }
  }

}

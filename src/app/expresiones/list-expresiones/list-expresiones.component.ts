import { MessageService } from 'primeng/api';
import { ActionClicked, IActionItemClickedArgs } from './../../shared/models/list-items';
import { SweetalertService } from './../../shared/services/sweetalert.service';
import { Component, OnDestroy, OnInit, AfterViewInit } from '@angular/core';
import { cloneDeep } from '@apollo/client/utilities';
import { Subscription } from 'rxjs';
import { ITableColumns } from '../../shared/ui/prime-ng/table/table.model';
import { ExpresionesFormComponent } from '../expresiones-form/expresiones-form.component';
import { ExpresionesService } from '../shared/services/expresiones.service';
import { DinamicDialogService } from '../../shared/ui/prime-ng/dinamic-dialog/dinamic-dialog.service';
import { isArray } from 'lodash';

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

  constructor(
    private _expresionesSvc: ExpresionesService,
    private _dinamicDialogSvc: DinamicDialogService,
    private _sweetAlertSvc: SweetalertService,
    private _msgSvc: MessageService
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
      this._expresionesSvc.inicializarFg();

      this._dinamicDialogSvc.open('Agregar Expresión', ExpresionesFormComponent);
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
      this._expresionesSvc.inicializarFg();
      this._expresionesSvc.loadExpresionResumenById(data.IdExpresion).subscribe(response => {
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

        this._dinamicDialogSvc.open('Editar Expresión', ExpresionesFormComponent);
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
      this._sweetAlertSvc.question('¿Desea Eliminar la(s) Expresión(es) seleccionada(s)?').then(res => {
        if (res === ActionClicked.Yes) {
          const IDsToRemove: number[] = !isArray(data) ? [data.IdExpresion] :  data.map(d => { return d.IdExpresion });

          this._expresionesSvc.deleteExpresionResumen(IDsToRemove).subscribe(response => {
            const result = response.deleteExpresionResumen;

            if (!result.success) {
              throw new Error(result.error);
            }

            this._msgSvc.add({ severity: 'success', summary: 'Satisfactorio', detail: 'La Expresión se ha eliminado correctamente.' })
          });
        }
      });
    } catch (err: any) {
      this._sweetAlertSvc.error(`Ocurrió el siguiente error: ${ err }`);
    }
  }

}

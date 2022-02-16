import { ExpresionesService } from './../../expresiones/shared/services/expresiones.service';
import { UnidadesService } from './../../unidades/shared/services/unidades.service';
import { DinamicDialogService } from './../../shared/ui/prime-ng/dinamic-dialog/dinamic-dialog.service';
import { SweetalertService } from './../../shared/services/sweetalert.service';
import { OperadoresService } from './../../shared/services/operadores.service';
import { SelectItem } from 'primeng/api';
import { FormGroup } from '@angular/forms';
import { ActionClicked } from './../../shared/models/list-items';
import { Component, OnInit } from '@angular/core';
import { CompararValoresService } from '../shared/services/comparar-valores.service';

@Component({
  selector: 'app-comparar-valores-form',
  templateUrl: './comparar-valores-form.component.html',
  styleUrls: ['./comparar-valores-form.component.scss']
})
export class CompararValoresFormComponent implements OnInit {
  action: ActionClicked;

  fg: FormGroup;

  centrosValues: SelectItem[] = [];
  expresionesValues: SelectItem[] = [];
  operadoresValues: SelectItem[] = [];

  constructor(
    private _compararValoresSvc: CompararValoresService,
    private _expresionesSvc: ExpresionesService,
    private _unidadesSvc: UnidadesService,
    private _operadoresSvc: OperadoresService,
    private _sweetAlertSvc: SweetalertService,
    private _dinamicDialogSvc: DinamicDialogService
  ) { 
    this.fg = _compararValoresSvc.fg;
  }

  ngOnInit(): void {
    this.action = this._compararValoresSvc.fg.controls['id'].value === 0 ? ActionClicked.Add : ActionClicked.Edit;

    this._loadCentros();
    this._loadExpresiones();
    this._loadOperadores();
  }
  
  private _loadCentros(): void {
    try {
      this._compararValoresSvc.subscription.push(this._unidadesSvc.getAllUnidades().subscribe(response => {
        const result = response.getAllUnidades;

        if (!result.success) {
          throw new Error(result.error);
        }

        this.centrosValues = result.data.map((u: { IdUnidad: number, Nombre: string }) => {
          return {
            value: u.IdUnidad,
            label: u.IdUnidad + '-' + u.Nombre
          };
        });
      }));
    } catch (err: any) {
      this._sweetAlertSvc.error(`Ocurrió el siguiente error: ${ err }`);
    }
  }

  private _loadExpresiones(): void {
    try {
      this._compararValoresSvc.subscription.push(this._expresionesSvc.loadAllExpresionesResumen().subscribe(response => {
        const result = response.getAllExpresionesResumen;

        if (!result.success) {
          throw new Error(result.error);
        }

        this.expresionesValues = result.data.map(e => {
          return {
            value: e.IdExpresion,
            label: e.Expresion
          };
        });
      }));
    } catch (err: any) {
      this._sweetAlertSvc.error(`Ocurrió el siguiente error: ${ err }`);
    }
  }

  private _loadOperadores(): void {
    try {
      this._compararValoresSvc.subscription.push(this._operadoresSvc.getOperadores().subscribe(response => {
        const result = response.getAllOperadores;

        if (!result.success) {
          throw new Error(result.error);
        }

        this.operadoresValues = result.data.map((o: { Id: any; Operador: any; }) => {
          return {
            value: o.Id,
            label: o.Operador
          };
        });
      }));
    } catch (err: any) {
      this._sweetAlertSvc.error(`Ocurrió el siguiente error: ${ err }`);
    }
  }

  onActionClicked(event: ActionClicked): void {
    switch (event) {
      case ActionClicked.Save:
        this._save();
        break;
      case ActionClicked.Cancel:
        this._dinamicDialogSvc.close();
        break;
    }
  }

  private _save(): void {
    try {
      this._compararValoresSvc.subscription.push(this._compararValoresSvc.save().subscribe(response => {
        const result = this.action === ActionClicked.Add ? response.createComprobarValor : response.updateComprobarValor;
         
        if (!result.success) {
          throw new Error(result.error);
        }

        let txtMessage = `El Valor de la Expresión se ha ${ this.action === ActionClicked.Add ? 'creado' : 'actualizado' } correctamente.`

        this._dinamicDialogSvc.close(txtMessage);
      }));
    } catch (err: any) {
      this._sweetAlertSvc.error(`Ha ocurrido el siguiente error: ${ err }`);
    }
  }

}

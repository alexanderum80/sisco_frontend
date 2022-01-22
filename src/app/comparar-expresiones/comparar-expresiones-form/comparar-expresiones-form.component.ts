import { DinamicDialogService } from './../../shared/ui/prime-ng/dinamic-dialog/dinamic-dialog.service';
import { ActionClicked } from './../../shared/models/list-items';
import { OperadoresService } from './../../shared/services/operadores.service';
import { ExpresionesService } from './../../expresiones/shared/services/expresiones.service';
import { SweetalertService } from './../../shared/services/sweetalert.service';
import { FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { CompararExpresionesService } from '../shared/services/comparar-expresiones.service';
import { SelectItem } from 'primeng/api';

@Component({
  selector: 'app-comparar-expresiones-form',
  templateUrl: './comparar-expresiones-form.component.html',
  styleUrls: ['./comparar-expresiones-form.component.scss']
})
export class CompararExpresionesFormComponent implements OnInit {
  action: ActionClicked;

  fg: FormGroup;

  expresionesValues: SelectItem[] = [];
  operadoresValues: SelectItem[] = [];

  constructor(
    private _compararExpresionesSvc: CompararExpresionesService,
    private _expresionesSvc: ExpresionesService,
    private _operadoresSvc: OperadoresService,
    private _dinamicDialogSvc: DinamicDialogService,
    private _sweetAlertSvc: SweetalertService
  ) {
    this.fg = _compararExpresionesSvc.fg;
  }

  ngOnInit(): void {
    this.action = this._compararExpresionesSvc.fg.controls['id'].value === 0 ? ActionClicked.Add : ActionClicked.Edit;

    this._loadExpresiones();
    this._loadOperadores();
  }

  private _loadExpresiones(): void {
    try {
      this._expresionesSvc.loadAllExpresionesResumen().subscribe(response => {
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
      });
    } catch (err: any) {
      this._sweetAlertSvc.error(`Ocurrió el siguiente error: ${ err }`);
    }
  }

  private _loadOperadores(): void {
    try {
      this._operadoresSvc.getCargos().subscribe(response => {
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
      });
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
      this._compararExpresionesSvc.save().subscribe(response => {
        const result = this.action === ActionClicked.Add ? response.createComprobarExpresion : response.updateComprobarExpresion;
         
        if (!result.success) {
          throw new Error(result.error);
        }

        let txtMessage = `La Comparación de la Expresión se ha ${ this.action === ActionClicked.Add ? 'creado' : 'actualizado' } correctamente.`

        this._dinamicDialogSvc.close(txtMessage);
      });
    } catch (err: any) {
      this._sweetAlertSvc.error(`Ha ocurrido el siguiente error: ${ err }`);
    }
  }

}

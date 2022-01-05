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

  onActionClicked(event: any): void {
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
      const payload = {
        Id: this.fg.controls['id'].value,
        Expresion: this.fg.controls['expresion'].value,
        Operador: this.fg.controls['operador'].value,
        ExpresionC: this.fg.controls['expresionC'].value,
        Centro: this.fg.controls['centro'].value,
        Complejo: this.fg.controls['complejo'].value,
        Con: this.fg.controls['consolidado'].value,
      };

      this._compararExpresionesSvc.saveCompararExpresion(payload).subscribe(response => {
        const result = response.saveComprobarExpresion;
        if (!result.success) {
          throw new Error(result.error);
        }

        this._dinamicDialogSvc.close();
      });
    } catch (err: any) {
      this._sweetAlertSvc.error(`Ha ocurrido el siguiente error: ${ err }`);
    }
  }

}

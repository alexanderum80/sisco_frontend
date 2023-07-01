import { DinamicDialogService } from './../../shared/ui/prime-ng/dinamic-dialog/dinamic-dialog.service';
import { ActionClicked } from './../../shared/models/list-items';
import { OperadoresService } from './../../shared/services/operadores.service';
import { ExpresionesService } from './../../expresiones/shared/services/expresiones.service';
import { SweetalertService } from './../../shared/helpers/sweetalert.service';
import { FormGroup } from '@angular/forms';
import {
  AfterContentChecked,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { CompararExpresionesService } from '../shared/services/comparar-expresiones.service';
import { SelectItem } from 'primeng/api';

@Component({
  selector: 'app-comparar-expresiones-form',
  templateUrl: './comparar-expresiones-form.component.html',
  styleUrls: ['./comparar-expresiones-form.component.scss'],
})
export class CompararExpresionesFormComponent
  implements OnInit, AfterContentChecked
{
  action: ActionClicked;

  fg: FormGroup;

  expresionesValues: SelectItem[] = [];
  operadoresValues: SelectItem[] = [];

  constructor(
    private _compararExpresionesSvc: CompararExpresionesService,
    private _expresionesSvc: ExpresionesService,
    private _operadoresSvc: OperadoresService,
    private _dinamicDialogSvc: DinamicDialogService,
    private _swalSvc: SweetalertService,
    private _cd: ChangeDetectorRef
  ) {
    this.fg = _compararExpresionesSvc.fg;
  }

  ngOnInit(): void {
    this.action =
      this._compararExpresionesSvc.fg.controls['id'].value === 0
        ? ActionClicked.Add
        : ActionClicked.Edit;

    this._loadExpresiones();
    this._loadOperadores();
  }

  ngAfterContentChecked(): void {
    this._cd.detectChanges();
  }

  private _loadExpresiones(): void {
    try {
      this._compararExpresionesSvc.subscription.push(
        this._expresionesSvc.loadAllExpresionesResumen().subscribe({
          next: res => {
            const result = res.getAllExpresionesResumen;

            this.expresionesValues = result.map(e => {
              return {
                value: e.IdExpresion,
                label: e.Expresion,
              };
            });
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

  private _loadOperadores(): void {
    try {
      this._compararExpresionesSvc.subscription.push(
        this._operadoresSvc.getOperadores().subscribe(res => {
          const result = res.getAllOperadores;

          if (!result.success) {
            throw new Error(result.error);
          }

          this.operadoresValues = result.data.map(
            (o: { Id: any; Operador: any }) => {
              return {
                value: o.Id,
                label: o.Operador,
              };
            }
          );
        })
      );
    } catch (err: any) {
      this._swalSvc.error(err);
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
      this._compararExpresionesSvc.subscription.push(
        this._compararExpresionesSvc.save().subscribe(res => {
          const result =
            this.action === ActionClicked.Add
              ? res.createComprobarExpresion
              : res.updateComprobarExpresion;

          if (!result.success) {
            throw new Error(result.error);
          }

          let txtMessage = `La Comparación de la Expresión se ha ${
            this.action === ActionClicked.Add ? 'creado' : 'actualizado'
          } correctamente.`;

          this._dinamicDialogSvc.close(txtMessage);
        })
      );
    } catch (err: any) {
      this._swalSvc.error(err);
    }
  }
}

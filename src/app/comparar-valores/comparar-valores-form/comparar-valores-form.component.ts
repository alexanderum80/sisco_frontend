import { ExpresionesService } from './../../expresiones/shared/services/expresiones.service';
import { UnidadesService } from './../../unidades/shared/services/unidades.service';
import { DinamicDialogService } from './../../shared/ui/prime-ng/dinamic-dialog/dinamic-dialog.service';
import { SweetalertService } from './../../shared/helpers/sweetalert.service';
import { OperadoresService } from './../../shared/services/operadores.service';
import { SelectItem } from 'primeng/api';
import { FormGroup } from '@angular/forms';
import { ActionClicked } from './../../shared/models/list-items';
import {
  AfterContentChecked,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { CompararValoresService } from '../shared/services/comparar-valores.service';
import { IUnidades } from 'src/app/unidades/shared/models/unidades.model';

@Component({
  selector: 'app-comparar-valores-form',
  templateUrl: './comparar-valores-form.component.html',
  styleUrls: ['./comparar-valores-form.component.scss'],
})
export class CompararValoresFormComponent
  implements OnInit, AfterContentChecked
{
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
    private _swalSvc: SweetalertService,
    private _dinamicDialogSvc: DinamicDialogService,
    private _cd: ChangeDetectorRef
  ) {
    this.fg = _compararValoresSvc.fg;
  }

  ngOnInit(): void {
    this.action =
      this._compararValoresSvc.fg.controls['id'].value === 0
        ? ActionClicked.Add
        : ActionClicked.Edit;

    this._loadCentros();
    this._loadExpresiones();
    this._loadOperadores();
  }

  ngAfterContentChecked(): void {
    this._cd.detectChanges();
  }

  private _loadCentros(): void {
    try {
      this._compararValoresSvc.subscription.push(
        this._unidadesSvc.getAllUnidadesByUsuario().subscribe({
          next: res => {
            const data = res.getAllUnidadesByUsuario;

            this.centrosValues = data.map((u: IUnidades) => {
              return {
                value: u.IdUnidad,
                label: u.Nombre,
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

  private _loadExpresiones(): void {
    try {
      this._compararValoresSvc.subscription.push(
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
      this._compararValoresSvc.subscription.push(
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
      this._compararValoresSvc.subscription.push(
        this._compararValoresSvc.save().subscribe(res => {
          const result =
            this.action === ActionClicked.Add
              ? res.createComprobarValor
              : res.updateComprobarValor;

          if (!result.success) {
            throw new Error(result.error);
          }

          let txtMessage = `El Valor de la Expresión se ha ${
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

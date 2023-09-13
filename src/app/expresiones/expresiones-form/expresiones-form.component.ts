import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActionClicked } from '../../shared/models';
import { ExpresionesService } from '../shared/services/expresiones.service';
import { DinamicDialogService } from 'src/app/shared/ui/prime-ng/dinamic-dialog/dinamic-dialog.service';
import { SelectItem } from 'primeng/api';
import { SweetalertService } from 'src/app/shared/helpers/sweetalert.service';
import { cloneDeep } from 'lodash';

@Component({
  selector: 'app-expresiones-form',
  templateUrl: './expresiones-form.component.html',
  styleUrls: ['./expresiones-form.component.scss'],
})
export class ExpresionesFormComponent implements OnInit {
  fg: FormGroup;

  editing = false;

  expresionesDetalle: any[] = [];

  clonedExpresion: { [s: string]: any } = {};

  signosValues: SelectItem[] = [
    { value: '+', label: '+' },
    { value: '-', label: '-' },
  ];

  tipoValorValues: SelectItem[] = [];

  constructor(
    private _dinamicDialogSvc: DinamicDialogService,
    private _expresionesSvc: ExpresionesService,
    private _swalSvc: SweetalertService
  ) {
    this.fg = _expresionesSvc.fg;
  }

  async ngOnInit(): Promise<void> {
    await this._loadTipoValorExpresiones();
    this._loadExpresionesDetalle();
  }

  private _loadTipoValorExpresiones(): void {
    try {
      this._expresionesSvc.loadAllTipoValorExpresiones().subscribe(res => {
        const result = res.getAllContaTipoValorExpresiones;

        this.tipoValorValues = result.map(r => {
          return {
            value: r.IdTipoValor,
            label: r.Valor,
          };
        });
      });
    } catch (err: any) {
      this._swalSvc.error(err);
    }
  }

  private _loadExpresionesDetalle(): void {
    try {
      const idExpresionResumen = this.fg.controls['idExpresion'].value;
      this._expresionesSvc
        .loadExpresionDetalleByIdResumen(idExpresionResumen)
        .subscribe({
          next: res => {
            const result = cloneDeep(res.getExpresionesDetalleByIdResumen);

            result.map(d => {
              d.TipoValorDesc = this.tipoValorValues.find(
                t => t.value === d.TipoValor
              )?.label;
            });

            this.expresionesDetalle = [...result];
          },
          error: err => {
            this._swalSvc.error(err);
          },
        });
    } catch (err: any) {
      this._swalSvc.error(err);
    }
  }

  addCuenta(): void {
    this.expresionesDetalle.push({
      id: 90000 + this.expresionesDetalle.length,
      IdExpresion: 0,
      Cta: '',
      SubCta: '',
      Crit1: '',
      Crit2: '',
      Crit3: '',
      Signo: '+',
      PorCiento: '100',
      TipoValor: this.tipoValorValues[0]?.value || 0,
      TipoValorDesc: this.tipoValorValues[0]?.label || '',
    });
  }

  onRowEditInit(expresion: any): void {
    this.clonedExpresion[expresion.id] = { ...expresion };
  }

  onRowDelete(index: any): void {
    this._swalSvc
      .question('¿Desea Eliminar la Cuenta seleccionada?')
      .then(res => {
        if (res === ActionClicked.Yes) this.expresionesDetalle.splice(index, 1);
      });
  }

  onRowEditSave(expresion: any): void {
    delete this.clonedExpresion[expresion.id];
  }

  onRowEditCancel(expresion: any, index: number): void {
    this.expresionesDetalle[index] = this.clonedExpresion[expresion.Id];
    delete this.clonedExpresion[expresion.Id];
  }

  onChangeTipoValor(event: any, index: any): void {
    const tipoValor = this.tipoValorValues.find(t => t.value === event.value);
    this.expresionesDetalle[index].TipoValorDesc = tipoValor?.label;
  }

  onActionClicked(event: ActionClicked): void {
    switch (event) {
      case ActionClicked.Save:
        this._save();
        break;
      case ActionClicked.Cancel:
        this._closeModal();
        break;
    }
  }

  private _save(): void {
    try {
      const ExpresionResumen = {
        IdExpresion: this.fg.controls['idExpresion'].value,
        Expresion: this.fg.controls['expresion'].value,
        Descripcion: this.fg.controls['descripcion'].value,
        Acumulado: this.fg.controls['acumulado'].value,
        OperacionesInternas: this.fg.controls['operacionesInternas'].value,
        Centralizada: this.fg.controls['centralizada'].value,
        IdDivision: this.fg.controls['idDivision'].value,
      };
      const ExpresionesDetalle = this.expresionesDetalle.map(exp => {
        return {
          Id: exp.Id,
          IdExpresion: exp.IdExpresion,
          Cta: exp.Cta,
          SubCta: exp.SubCta,
          Crit1: exp.Crit1,
          Crit2: exp.Crit2,
          Crit3: exp.Crit3,
          Signo: exp.Signo,
          PorCiento: Number(exp.PorCiento),
          TipoValor: exp.TipoValor,
        };
      });

      const payload = {
        ExpresionResumen,
        ExpresionesDetalle,
      };

      this._expresionesSvc.saveExpresion(payload).subscribe({
        next: res => {
          const result =
            ExpresionResumen.IdExpresion === 0
              ? res.createExpresion
              : res.updateExpresion;
          const txtMessage = `La Expresión se ha ${
            ExpresionResumen.IdExpresion === 0 ? 'creado' : 'actualizado'
          } correctamente.`;
          if (!result.success) {
            throw new Error(result.error);
          }

          this._dinamicDialogSvc.close(txtMessage);
        },
        error: err => {
          this._swalSvc.error(err);
        },
      });
    } catch (err: any) {
      this._swalSvc.error(err);
    }
  }

  private _closeModal(message?: string): void {
    this._dinamicDialogSvc.close(message);
  }
}

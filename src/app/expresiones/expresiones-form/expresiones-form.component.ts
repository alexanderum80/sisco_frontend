import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActionClicked } from '../../shared/models';
import { ExpresionesService } from '../shared/services/expresiones.service';
import { DinamicDialogService } from 'src/app/shared/ui/prime-ng/dinamic-dialog/dinamic-dialog.service';
import { SelectItem } from 'primeng/api';
import Swal from 'sweetalert2';
import { cloneDeep } from '@apollo/client/utilities';

@Component({
  selector: 'app-expresiones-form',
  templateUrl: './expresiones-form.component.html',
  styleUrls: ['./expresiones-form.component.scss']
})
export class ExpresionesFormComponent implements OnInit {
  fg: FormGroup;

  editing = false;

  expresionesDetalle: any[] = [];

  clonedExpresion: { [s: string]: any; } = {};

  signosValues: SelectItem[] = [
    { value: '+', label: '+' },
    { value: '-', label: '-' },
  ];

  tipoValorValues: SelectItem[] = [];

  constructor(
    private _dinamicDialogSvc: DinamicDialogService,
    private _expresionesSvc: ExpresionesService
  ) {
    this.fg = _expresionesSvc.fg;
   }

  async ngOnInit(): Promise<void> {
    await this._loadTipoValorExpresiones();
    this._loadExpresionesDetalle();
  }

  private _loadTipoValorExpresiones(): void {
    try {
      this._expresionesSvc.loadAllTipoValorExpresiones().subscribe(response => {
        const result = response.getAllContaTipoValorExpresiones;

        if (!result.success) {
          throw new Error(result.error);
        }

        this.tipoValorValues = result.data.map(r => {
          return {
            value: r.IdTipoValor,
            label: r.Valor
          };
        });
      });
    } catch (err: any) {
      Swal.fire({
        icon: 'error',
        title: 'ERROR',
        text: `Ha ocurrido el siguiente error: ${ err }`,
        showConfirmButton: true,
        confirmButtonText: 'Aceptar'
      });
    }
  }

  private _loadExpresionesDetalle(): void {
    try {
      const idExpresionResumen = this.fg.controls['idExpresion'].value;
      this._expresionesSvc.loadExpresionDetalleByIdResumen(idExpresionResumen).subscribe(response => {
        const result = response.getExpresionesDetalleByIdResumen;

        if (!result.success) {
          throw new Error(result.error);
        }

        const data = cloneDeep(result.data);

        data.map(d => {
          d.TipoValorDesc = this.tipoValorValues.find(t => t.value === d.TipoValor)?.label;
        });

        this.expresionesDetalle = data;
      });
    } catch (err: any) {
      Swal.fire({
        icon: 'error',
        title: 'ERROR',
        text: `Ha ocurrido el siguiente error: ${ err }`,
        showConfirmButton: true,
        confirmButtonText: 'Aceptar'
      });
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
      TipoValorDesc: this.tipoValorValues[0]?.label || ''
    });
  }

  onRowEditInit(expresion: any): void {
    this.clonedExpresion[expresion.id] = {...expresion};
  }

  onRowDelete(index: any): void {
    Swal.fire({
      title: 'Confirmación',
      text: '¿Desea Eliminar la Cuenta seleccionada?',
      icon: 'question',
      confirmButtonText: 'Sí',
      showCancelButton: true,
      cancelButtonText: 'No'
    }).then(result => {
      if (result.value) {
        this.expresionesDetalle.splice(index, 1);
      }
    });
  }

  onRowEditSave(expresion: any): void {
    delete this.clonedExpresion[expresion.id];
  }

  onRowEditCancel(expresion: any, index: number): void {
    this.expresionesDetalle[index] = this.clonedExpresion[expresion.id];
    delete this.clonedExpresion[expresion.id];
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
          id: exp.id,
          IdExpresion: exp.IdExpresion,
          Cta: exp.Cta,
          SubCta: exp.SubCta,
          Crit1: exp.Crit1,
          Crit2: exp.Crit2,
          Crit3: exp.Crit3,
          Signo: exp.Signo,
          PorCiento: Number(exp.PorCiento),
          TipoValor: exp.TipoValor
        };
      });

      const payload = {
        ExpresionResumen,
        ExpresionesDetalle
      };

      this._expresionesSvc.saveExpresion(payload).subscribe(response => {
        const result = ExpresionResumen.IdExpresion === 0 ? response.createExpresion : response.updateExpresion;
        const txtMessage = `La Expresión se ha ${ ExpresionResumen.IdExpresion === 0 ? 'creado' : 'actualizado' } correctamente.`;
        if (!result.success) {
          throw new Error(result.error);
        }

        this._dinamicDialogSvc.close(txtMessage);
      });
    } catch (err: any) {
      Swal.fire({
        icon: 'error',
        title: 'ERROR',
        text: `Ha ocurrido el siguiente error: ${ err }`,
        showConfirmButton: true,
        confirmButtonText: 'Aceptar'
      });
    }
  }

   private _closeModal(message?: string): void {
    this._dinamicDialogSvc.close(message);
  }

}

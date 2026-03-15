import {
  LocaleFormatEnum,
  DateFormatEnum,
} from './../../../shared/models/date-range';
import { numberFormatter } from './../../../shared/models/number';
import { FormGroup, FormControl } from '@angular/forms';
import { Injectable } from '@angular/core';
import { formatDate } from '@angular/common';
import { SelectItem } from 'primeng/api';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'platform',
})
export class ConcilaInternaDwhService {
  fg: FormGroup = new FormGroup({
    idDivision: new FormControl(''),
    idSubdivision: new FormControl(''),
    idUnidad: new FormControl(''),
    idDivisionOD: new FormControl(''),
    idSubdivisionOD: new FormControl(''),
    idUnidadOD: new FormControl(''),
    fechaInicial: new FormControl(''),
    fechaFinal: new FormControl(''),
    soloDiferencias: new FormControl(true),
  });

  subscription: Subscription[] = [];

  constructor() {}

  public inicializarFormGroup(): void {
    const inputValues = {
      idDivision: null,
      idSubdivision: null,
      idUnidad: null,
      idDivisionOD: null,
      idSubdivisionOD: null,
      idUnidadOD: null,
      fechaInicial: new Date(),
      fechaFinal: new Date(),
      soloDiferencias: true,
    };

    this.fg.patchValue(inputValues);
  }

  public async getDivision(
    idDivision: number,
    divisionesList: SelectItem[]
  ): Promise<any> {
    const definition = [];

    const _division = divisionesList.find(u => u.value === idDivision);

    definition.push({
      text: `División:  ${_division?.label} `,
      bold: true,
      margin: [0, 5, 0, 0],
    });

    return definition;
  }

  public async getParteAtrasosDefinition(
    parteAtrasosData: any[],
    fechaInicial: Date,
    fechaFinal: Date
  ): Promise<any[]> {
    const definition = [];

    definition.push({
      columns: [
        [
          {
            text:
              'Fecha Inicial: ' +
              formatDate(
                fechaInicial,
                DateFormatEnum.ES_DATE,
                LocaleFormatEnum.EN_US
              ),
            bold: true,
            margin: [0, 10, 0, 2],
          },
          {
            text:
              'Fecha Final: ' +
              formatDate(
                fechaFinal,
                DateFormatEnum.ES_DATE,
                LocaleFormatEnum.EN_US
              ),
            bold: true,
            margin: [0, 2, 0, 10],
          },
        ],
      ],
    });

    if (parteAtrasosData.length) {
      definition.push(this._getParteAtrasosTable(parteAtrasosData));
    }

    return definition;
  }

  private _getParteAtrasosTable(conciliaInternaDWH: any): any[] {
    let _totalImporteE = 0;
    let _totalImporteR = 0;
    let _totalDiferencia = 0;

    const returnValue = [];

    returnValue.push({
      table: {
        widths: [70, 40, 50, 70, 40, 50, 70, 70],
        body: [
          [
            {
              text: 'Documento',
              style: 'tableHeader',
            },
            {
              text: 'Emisor',
              style: 'tableHeader',
              alignment: 'center',
            },
            {
              text: 'Fecha Emisión',
              style: 'tableHeader',
            },
            {
              text: 'Importe Emisor',
              style: 'tableHeader',
              alignment: 'right',
            },
            {
              text: 'Receptor',
              style: 'tableHeader',
              alignment: 'center',
            },
            {
              text: 'Fecha Recepción',
              style: 'tableHeader',
            },
            {
              text: 'Importe Receptor',
              style: 'tableHeader',
              alignment: 'right',
            },
            {
              text: 'Diferencia',
              style: 'tableHeader',
              alignment: 'right',
            },
          ],
          ...conciliaInternaDWH.map((p: any) => {
            _totalImporteE += p.ImporteE;
            _totalImporteR += p.ImporteR;
            _totalDiferencia += p.Diferencia;

            return [
              p.Documento,
              p.Emisor,
              formatDate(
                p.FechaE,
                DateFormatEnum.ES_DATE,
                LocaleFormatEnum.EN_US
              ),
              { text: numberFormatter.format(p.ImporteE), alignment: 'right' },
              p.Receptor,
              formatDate(
                p.FechaR,
                DateFormatEnum.ES_DATE,
                LocaleFormatEnum.EN_US
              ),
              { text: numberFormatter.format(p.ImporteR), alignment: 'right' },
              {
                text: numberFormatter.format(p.Diferencia),
                alignment: 'right',
              },
            ];
          }),
          // total row
          [
            {
              text: 'TOTAL',
              style: 'tableHeader',
            },
            {
              text: '',
              style: 'tableHeader',
            },
            {
              text: '',
              style: 'tableHeader',
            },
            {
              text: numberFormatter.format(_totalImporteE),
              style: 'tableHeader',
              alignment: 'right',
            },
            {
              text: '',
              style: 'tableHeader',
            },
            {
              text: '',
              style: 'tableHeader',
            },
            {
              text: numberFormatter.format(_totalImporteR),
              style: 'tableHeader',
              alignment: 'right',
            },
            {
              text: numberFormatter.format(_totalDiferencia),
              style: 'tableHeader',
              alignment: 'right',
            },
          ],
        ],
        margin: [0, 10, 0, 0],
      },
    });

    return returnValue;
  }

  dispose() {
    this.subscription.forEach(subs => subs.unsubscribe());
  }
}

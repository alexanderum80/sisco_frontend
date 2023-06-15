import {
  LocaleFormatEnum,
  DateFormatEnum,
  getFirtsDateOfMonth,
} from './../../../shared/models/date-range';
import { numberFormatter } from './../../../shared/models/number';
import { FormGroup, FormControl } from '@angular/forms';
import { Injectable } from '@angular/core';
import { formatDate } from '@angular/common';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'platform',
})
export class ConcilaOperacionesDwhService {
  fg: FormGroup = new FormGroup({
    idDivision: new FormControl(null, { initialValueIsDefault: true }),
    idSubdivision: new FormControl('0', { initialValueIsDefault: true }),
    idUnidad: new FormControl('0', { initialValueIsDefault: true }),
    idDivisionOD: new FormControl(null, { initialValueIsDefault: true }),
    idSubdivisionOD: new FormControl('0', { initialValueIsDefault: true }),
    idUnidadOD: new FormControl('0', { initialValueIsDefault: true }),
    fechaInicial: new FormControl(getFirtsDateOfMonth(new Date()), {
      initialValueIsDefault: true,
    }),
    fechaFinal: new FormControl(new Date(), { initialValueIsDefault: true }),
    soloDiferencias: new FormControl(true, { initialValueIsDefault: true }),
  });

  subscription: Subscription[] = [];

  constructor() {}

  async getEmisorReceptorReporte() {
    return {
      margin: [0, 10, 0, 0],
      columns: [
        [
          {
            text: 'Centro a Analizar',
            bold: true,
            margin: [0, 0, 0, 5],
          },
          {
            text: `División: ${
              this.fg.get('idDivision')?.value?.IdDivision
                ? this.fg.get('idDivision')?.value?.IdDivision +
                  '-' +
                  this.fg.get('idDivision')?.value?.Division
                : '--TODAS--'
            }`,
            margin: [0, 0, 0, 5],
          },
          {
            text: `Subdivisión: ${
              this.fg.get('idSubdivision')?.value?.IdSubdivision
                ? this.fg.get('idSubdivision')?.value?.IdSubdivision +
                  '-' +
                  this.fg.get('idSubdivision')?.value?.Subdivision
                : '--TODAS--'
            }`,
            margin: [0, 0, 0, 5],
          },
          {
            text: `Unidad:   ${
              this.fg.get('idUnidad')?.value?.Nombre || '--TODAS--'
            }`,
            margin: [0, 0, 0, 5],
          },
        ],
        [
          {
            text: 'Centro Emisor / Receptor',
            bold: true,
            margin: [0, 0, 0, 5],
          },
          {
            text: `División: ${
              this.fg.get('idDivisionOD')?.value?.IdDivision
                ? this.fg.get('idDivisionOD')?.value?.IdDivision +
                  '-' +
                  this.fg.get('idDivisionOD')?.value?.Division
                : '--TODAS--'
            }`,
            margin: [0, 0, 0, 5],
          },
          {
            text: `Subdivisión: ${
              this.fg.get('idSubdivisionOD')?.value?.IdSubdivision
                ? this.fg.get('idSubdivisionOD')?.value?.IdSubdivision +
                  '-' +
                  this.fg.get('idSubdivisionOD')?.value?.Subdivision
                : '--TODAS--'
            }`,
            margin: [0, 0, 0, 5],
          },
          {
            text: `Unidad:   ${
              this.fg.get('idUnidadOD')?.value?.Nombre || '--TODAS--'
            }`,
            margin: [0, 0, 0, 5],
          },
        ],
      ],
    };
  }

  public async getConciliacionDefinition(
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
      definition.push(this._getConciliaInternaDwhTable(parteAtrasosData));
    }

    return definition;
  }

  private _getConciliaInternaDwhTable(conciliaInternaDWH: any): any[] {
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
              p.FechaE,
              // formatDate(
              //   p.FechaE,
              //   DateFormatEnum.ES_DATE,
              //   LocaleFormatEnum.EN_US
              // ),
              { text: numberFormatter.format(p.ImporteE), alignment: 'right' },
              p.Receptor,
              p.FechaR,
              // formatDate(
              //   p.FechaR,
              //   DateFormatEnum.ES_DATE,
              //   LocaleFormatEnum.EN_US
              // ),
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

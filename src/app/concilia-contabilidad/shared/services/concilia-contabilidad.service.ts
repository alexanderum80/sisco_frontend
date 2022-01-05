import { SelectItem } from 'primeng/api';
import { FormGroup, FormControl } from '@angular/forms';
import { numberFormatter } from './../../../shared/models/number';
import { Injectable } from '@angular/core';
import { uniq } from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class ConciliaContabilidadService {

  fg: FormGroup = new FormGroup({
    tipoCentro: new FormControl('0'),
    idCentro: new FormControl(''),
    tipoEntidad: new FormControl(''),
    periodo: new FormControl(''),
    apertura: new FormControl(false),
    cierre: new FormControl(false),
    nota: new FormControl(''),
  });

  constructor() { }

  public async getCentro(idUnidad: number, unidadesList: SelectItem[]): Promise<any> {
    const definition = [];

    const _unidad = unidadesList.find(u => u.value === idUnidad);

    definition.push({
      text: `Centro:  ${ _unidad?.label } `,
      bold: true,
      margin: [0, 5, 0, 0]
    });

    return definition;
  }

  public async getTipoEntidad(tipoCentro: number, tipoCentrosList: SelectItem[]): Promise<any> {
    const definition = [];

    const _unidad = tipoCentrosList.find(u => u.value === tipoCentro);

    definition.push({
      text: `Tipo de Contabilidad:  ${ _unidad?.label } `,
      bold: true,
      margin: [0, 5, 0, 0]
    });

    return definition;
  }

  public async getReporteAsientoDefinition(data: any): Promise<any> {
    if (typeof data === 'string') {
      data = [];
    }

    const definition: any[] = [];

    const consultas = uniq(data.map((d: { Consulta: any; }) => d.Consulta));

    consultas.forEach(element => {
      definition.push({
        text: 'Consulta: ' + element,
        bold: true,
        margin: [0, 10, 0, 0]
      });

      const _filteredData = data.filter((f: { Consulta: string; }) => f.Consulta === element);

      definition.push(this._getReporteAsientoTable(_filteredData));
    });

    return definition;
  }

  private _getReporteAsientoTable(data: any): object {
    let total = 0;

    const returnValue = {
      table: {
        widths: ['*', '*', '*', '*', '*', '*'],
        body: [
          [{
            text: 'Cuenta',
            style: 'tableHeader'
          },
          {
            text: 'SubCuenta',
            style: 'tableHeader'
          },
          {
            text: 'Análisis 1',
            style: 'tableHeader',
          },
          {
            text: 'Análisis 2',
            style: 'tableHeader',
          },
          {
            text: 'Análisis 3',
            style: 'tableHeader',
          },
          {
            text: 'Total',
            style: 'tableHeader',
            alignment : 'right'
          },
          ],
          ...data.map((al: any) => {
            total += al.Total;
            return [al.Cuenta, al.SubCuenta, al.Analisis1, al.Analisis2, al.Analisis3,
              { text: numberFormatter.format(al.Total), alignment: 'right' }
            ];
          }),
          [{}, {}, {}, {}, { text: 'TOTAL', bold: true, alignment: 'right' }, { text: numberFormatter.format(total), bold: true, alignment: 'right' }]
        ]
      }
    };

    return returnValue;
  }

  public async getReporteExpresionesDefinition(data: any[]): Promise<any> {
    const definition = [];

    definition.push({
      text: 'Chequeo entre expresiones',
      bold: true,
      margin: [0, 10, 0, 0]
    },
    {
      table: {
        widths: [140, 60, 30, 140, 60, 50],
        body: [
          [{
            text: 'Expresión',
            style: 'tableHeader'
          },
          {
            text: 'Valor',
            style: 'tableHeader',
            alignment : 'right'
          },
          {
            text: 'Opr.',
            style: 'tableHeader',
            alignment: 'center'
          },
          {
            text: 'Expresión',
            style: 'tableHeader',
          },
          {
            text: 'Valor',
            style: 'tableHeader',
            alignment : 'right'
          },
          {
            text: 'Estado',
            style: 'tableHeader',
          },
          ],
          ...data.map(d => {
            return [d.Expresion, { text: numberFormatter.format(d.Valor), alignment: 'right' }, { text: d.Operador, alignment: 'center' },
              d.ExpresionC, { text: numberFormatter.format(d.ValorC), alignment: 'right' },
              { text: d.Resultado, bold: true, color: d.Resultado === 'Incorrecto' ? 'red' : 'blue' }
            ];
          })
        ]
      }
    });

    return definition;
  }

  public async getReporteValoresDefinition(data: any[]): Promise<any> {
    const definition = [];

    definition.push({
      text: 'Chequeo entre valores',
      bold: true,
      margin: [0, 10, 0, 0]
    });

    const expresiones = uniq(data.map(d => d.Expresion));

    expresiones.forEach(element => {
      definition.push({
        text: 'Expresión: ' + element,
        bold: true,
        italics: true,
        margin: [0, 10, 0, 0]
      });

      const _filteredData = data.filter(f => f.Expresion === element);

      definition.push(this._getReporteValoresTable(_filteredData));
    });

    return definition;
  }

  private _getReporteValoresTable(data: any): object {
    const returnValue = {
      table: {
        widths: [150, 100, 40, 100, 60],
        body: [
          [{
            text: 'Centro',
            style: 'tableHeader'
          },
          {
            text: 'Valor',
            style: 'tableHeader',
            alignment : 'right'
          },
          {
            text: 'Opr.',
            style: 'tableHeader',
            alignment: 'center'
          },
          {
            text: 'Valor Rodas',
            style: 'tableHeader',
            alignment : 'right'
          },
          {
            text: 'Estado',
            style: 'tableHeader',
          },
          ],
          ...data.map((d: any) => {
            return [d.Codigo, { text: numberFormatter.format(d.Valor), alignment: 'right' }, { text: d.Operador, alignment: 'center' },
              { text: numberFormatter.format(d.ValorRodas), alignment: 'right' },
              { text: d.Estado, bold: true, color: d.Estado === 'Incorrecto' ? 'red' : 'blue' }
            ];
          })
        ]
      }
    };

    return returnValue;
  }

  public async getReporteDiferenciaClasificadorDefinition(data: any[]): Promise<any> {
    const definition = [];

    definition.push(
      {
        text: '',
        margin: [0, 10, 0, 0]
      },
      {
        table: {
          widths: [30, 30, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27],
          body: [
            [{
              text: 'Cuenta',
              style: 'tableHeader'
            },
            {
              text: 'SubCta',
              style: 'tableHeader',
            },
            {
              text: 'Crt1 Clasif',
              style: 'tableHeader',
            },
            {
              text: 'Crt1 Rodas',
              style: 'tableHeader',
            },
            {
              text: 'Crt2 Clasif',
              style: 'tableHeader',
            },
            {
              text: 'Crt2 Rodas',
              style: 'tableHeader',
            },
            {
              text: 'Crt3 Clasif',
              style: 'tableHeader',
            },
            {
              text: 'Crt3 Rodas',
              style: 'tableHeader',
            },
            {
              text: 'Nat Clasif',
              style: 'tableHeader',
            },
            {
              text: 'Nat Rodas',
              style: 'tableHeader',
            },
            {
              text: 'Obl Clasif',
              style: 'tableHeader',
            },
            {
              text: 'Obl Rodas',
              style: 'tableHeader',
            },
            {
              text: 'Term Clasif',
              style: 'tableHeader',
            },
            {
              text: 'Term Rodas',
              style: 'tableHeader',
            },
            {
              text: 'Crt1 Cons Clasif',
              style: 'tableHeader',
            },
            {
              text: 'Crt1 Cons Rodas',
              style: 'tableHeader',
            },
            {
              text: 'Crt2 Cons Clasif',
              style: 'tableHeader',
            },
            {
              text: 'Crt2 Cons Rodas',
              style: 'tableHeader',
            },
            {
              text: 'Crt3 Cons Clasif',
              style: 'tableHeader',
            },
            {
              text: 'Crt3 Cons Rodas',
              style: 'tableHeader',
            },
            ],
            ...data.map(d => {
              return [d.Cuenta, d.SubCuenta, d.Crt1Clasif, d.Crt1Rodas, d.Crt2Clasif, d.Crt2Rodas, d.Crt3Clasif, d.Crt3Rodas,
                d.NatClasif, d.NatRodas, d.OblClasif, d.OblRodas, d.TermClasf, d.TermRodas,
                d.Crit1ConsClasif, d.Crit1ConsRodas, d.Crit2ConsClasif, d.Crit2ConsRodas, d.Crit3ConsClasif, d.Crit3ConsRodas
              ];
            })
          ]
        }
      }
    );

    return definition;
  }

}

import { ConciliaContabilidadMutationReponse } from './../models/concilia-contabilidad.model';
import { Apollo } from 'apollo-angular';
import { Subscription, Observable } from 'rxjs';
import { SelectItem } from 'primeng/api';
import { FormGroup, FormControl } from '@angular/forms';
import { numberFormatter } from './../../../shared/models/number';
import { Injectable } from '@angular/core';
import { uniq, toNumber } from 'lodash';
import { ConciliaContabilidadQueryResponse } from '../models/concilia-contabilidad.model';
import { conciliaContabilidadApi } from '../graphql/concilia-contabilidad-api';
import * as moment from 'moment';

@Injectable()
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

  subscription: Subscription[] = [];

  constructor(
    private _apollo: Apollo
  ) { }

  inicializarFg() {
    const today = new Date();
    const fgValues = {
      tipoCentro: '0',
      idCentro: null,
      tipoEntidad: null,
      periodo: new Date(today.getFullYear(), today.getMonth(), 0),
      apertura: false,
      cierre: false,
      nota: '',
    };

    this.fg.patchValue(fgValues);
  }

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

  public async getConsolidado(idUnidad: number, unidadesList: SelectItem[]): Promise<any> {
    const definition = [];

    const _unidad = unidadesList.find(u => u.value === idUnidad);

    definition.push({
      text: `Consolidado:  ${ _unidad?.label } `,
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

  public conciliar(): Observable<ConciliaContabilidadQueryResponse> {
    let periodo = toNumber(moment(this.fg.controls['periodo'].value).format('MM'));
    if (this.fg.controls['apertura'].value)
      periodo = 0;
    if (this.fg.controls['cierre'].value)
      periodo = 13;
    
    const conciliaContaInput = {
      idCentro: toNumber(this.fg.controls['idCentro'].value),
      periodo: periodo,
      annio: toNumber(moment(this.fg.controls['periodo'].value).format('YYYY')),
      tipoCentro: toNumber(this.fg.controls['tipoCentro'].value),
      tipoEntidad: toNumber(this.fg.controls['tipoEntidad'].value),
    };

    return new Observable<ConciliaContabilidadQueryResponse>(subscriber => {
      this._apollo.query<ConciliaContabilidadQueryResponse>({
        query: conciliaContabilidadApi.concilia,
        variables: { conciliaContaInput },
        fetchPolicy: 'network-only'
      }).subscribe(response => {
        subscriber.next(response.data)
      });
    });
  }

  public iniciarSaldo(): Observable<ConciliaContabilidadMutationReponse> {
    const iniciarSaldosInput = {
      idCentro: toNumber(this.fg.controls['idCentro'].value),
      consolidado: this.fg.controls['tipoCentro'].value === 2,
      annio: toNumber(moment(this.fg.controls['periodo'].value).format('YYYY')),
    };

    return new Observable<ConciliaContabilidadMutationReponse>(subscriber => {
      this._apollo.mutate<ConciliaContabilidadMutationReponse>({
        mutation: conciliaContabilidadApi.inciarSaldo,
        variables: { iniciarSaldosInput },
      }).subscribe(response => {
        subscriber.next(response.data || undefined)
      });
    });
  }

  public chequearCentros(centrosAChequear: number[]): Observable<ConciliaContabilidadMutationReponse> {
    const chequearCentrosInput = {
      idCentro: toNumber(this.fg.controls['idCentro'].value),
      annio: toNumber(moment(this.fg.controls['periodo'].value).format('YYYY')),
      periodo: toNumber(moment(this.fg.controls['periodo'].value).format('MM')),
      centrosAChequear: centrosAChequear
    };

    return new Observable<ConciliaContabilidadMutationReponse>(subscriber => {
      this._apollo.mutate<ConciliaContabilidadMutationReponse>({
        mutation: conciliaContabilidadApi.chequearCentros,
        variables: { chequearCentrosInput },
      }).subscribe(response => {
        subscriber.next(response.data || undefined)
      });
    });
  }

  public async getReporteAsientoDefinition(data: any): Promise<any> {
    if (typeof data === 'string') {
      data = [];
    }

    const definition: any[] = [];

    const consultas = uniq(data.map((d: { Consulta: any; }) => d.Consulta));

    consultas.forEach(consulta => {
      definition.push({
        text: 'Consulta: ' + consulta,
        bold: true,
        margin: [0, 10, 0, 0]
      });

      const _filteredData = data.filter((f: { Consulta: string; }) => f.Consulta === consulta);

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
        widths: [140, 70, 20, 140, 70, 40],
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
    },
    {
      table: {
        widths: [230, 80, 40, 80, 60],
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
            return [d.Expresion, { text: numberFormatter.format(d.Valor), alignment: 'right' }, { text: d.Operador, alignment: 'center' },
              { text: numberFormatter.format(d.ValorRodas), alignment: 'right' },
              { text: d.Estado, bold: true, color: d.Estado === 'Incorrecto' ? 'red' : 'blue' }
            ];
          })
        ]
      }
    });

    return definition;
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

  public async getReporteChequeoDefinition(data: any): Promise<any> {
    if (typeof data === 'string') {
      data = [];
    }

    const definition: any[] = [];

    const unidades = uniq(data.map((d: { Unidad: any; }) => d.Unidad));

    unidades.forEach(unidad => {
      definition.push({
        text: 'Centro: ' + unidad,
        bold: true,
        margin: [0, 10, 0, 0]
      });

      const _filteredData = data.filter((f: { Unidad: string; }) => f.Unidad === unidad);

      definition.push(this._getReporteChequeoTable(_filteredData));
    });

    return definition;
  }

  private _getReporteChequeoTable(data: any): object {
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
            return [al.Cuenta, al.SubCuenta, al['Análisis 1'], al['Análisis 2'], al['Análisis 3'],
              { text: numberFormatter.format(al.Total), alignment: 'right' }
            ];
          }),
          [{}, {}, {}, {}, { text: 'TOTAL', bold: true, alignment: 'right' }, { text: numberFormatter.format(total), bold: true, alignment: 'right' }]
        ]
      }
    };

    return returnValue;
  }

  dispose() {
    this.subscription.forEach(subs => subs.unsubscribe());
  }

}

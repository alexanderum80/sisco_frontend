import { numberFormatter } from './../../../shared/models/number';
import { SelectItem } from 'primeng/api';
import { conciliaInternaContaApi } from './../graphql/concilia-interna-conta.api';
import { ApolloService } from './../../../shared/services/apollo.service';
import { Injectable } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';
import { toNumber } from 'lodash';
import * as moment from 'moment';

@Injectable()
export class ConciliaInternaContaService {
  fg: FormGroup = new FormGroup({
    idDivision: new FormControl('', { initialValueIsDefault: true }),
    idUnidad: new FormControl(null, { initialValueIsDefault: true }),
    idUnidadOD: new FormControl(null, { initialValueIsDefault: true }),
    periodo: new FormControl('', { initialValueIsDefault: true }),
    tipoCentro: new FormControl('1', { initialValueIsDefault: true }),
    soloDiferencias: new FormControl(true, { initialValueIsDefault: true }),
  });

  subscription: Subscription[] = [];

  constructor(private _apolloSvc: ApolloService) {}

  conciliar(): Observable<any> {
    return new Observable<any>(subscriber => {
      const conciliaInternaContaInput = {
        annio: toNumber(
          moment(this.fg.controls['periodo'].value).format('YYYY')
        ),
        periodo: toNumber(
          moment(this.fg.controls['periodo'].value).format('MM')
        ),
        centro: toNumber(this.fg.controls['idDivision'].value),
        unidad: toNumber(this.fg.controls['idUnidad'].value),
        emisorReceptor: toNumber(this.fg.controls['idUnidadOD'].value),
      };

      this.subscription.push(
        this._apolloSvc
          .query(conciliaInternaContaApi.concilia, {
            conciliaInternaContaInput: conciliaInternaContaInput,
          })
          .subscribe({
            next: res => {
              subscriber.next(res);
            },
            error: err => {
              subscriber.error(err);
            },
          })
      );
    });
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

  public async getConciliacionDefinition(
    conciliacionData: any[]
  ): Promise<any[]> {
    const definition = [];

    if (conciliacionData.length) {
      definition.push(this._getConciliaInternaContaTable(conciliacionData));
    }

    return definition;
  }

  private _getConciliaInternaContaTable(conciliaInternaConta: any): any[] {
    let _totalValorE = 0;
    let _totalValorR = 0;
    let _totalDiferencia = 0;

    const returnValue = [];

    returnValue.push({
      table: {
        widths: [35, 35, 30, 40, 40, 70, 20, 35, 35, 30, 40, 40, 70, 70],
        body: [
          [
            {
              text: 'Cuenta',
              style: 'tableHeader',
            },
            {
              text: 'SubCta',
              style: 'tableHeader',
              alignment: 'center',
            },
            {
              text: 'Tipo',
              style: 'tableHeader',
            },
            {
              text: 'Emisor',
              style: 'tableHeader',
            },
            {
              text: 'Receptor',
              style: 'tableHeader',
            },
            {
              text: 'Valor',
              style: 'tableHeader',
              alignment: 'right',
            },
            {
              text: 'Op.',
              style: 'tableHeader',
            },
            {
              text: 'Cuenta',
              style: 'tableHeader',
            },
            {
              text: 'SubCta',
              style: 'tableHeader',
            },
            {
              text: 'Tipo',
              style: 'tableHeader',
            },
            {
              text: 'Receptor',
              style: 'tableHeader',
            },
            {
              text: 'Emisor',
              style: 'tableHeader',
            },
            {
              text: 'Valor',
              style: 'tableHeader',
              alignment: 'right',
            },
            {
              text: 'Diferencia',
              style: 'tableHeader',
              alignment: 'right',
            },
          ],
          ...conciliaInternaConta.map((p: any) => {
            _totalValorE += p.ValorE;
            _totalValorR += p.ValorR;
            _totalDiferencia += p.Diferencia;

            return [
              p.CuentaE,
              p.SubCuentaE,
              p.TipoE,
              p.EmisorE,
              p.ReceptorE,
              { text: numberFormatter.format(p.ValorE), alignment: 'right' },
              p.Operador,
              p.CuentaR,
              p.SubCuentaR,
              p.TipoR,
              p.ReceptorR,
              p.EmisorR,
              { text: numberFormatter.format(p.ValorR), alignment: 'right' },
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
              text: '',
              style: 'tableHeader',
            },
            {
              text: '',
              style: 'tableHeader',
            },
            {
              text: numberFormatter.format(_totalValorE),
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
              text: '',
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
              text: '',
              style: 'tableHeader',
            },
            {
              text: numberFormatter.format(_totalValorR),
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

  dispose(): void {
    this.subscription.forEach(subs => subs.unsubscribe);
  }
}

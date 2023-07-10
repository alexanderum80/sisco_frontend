import { uniq, sortBy } from 'lodash';
import { numberFormatter } from './../../../shared/models/number';
import {
  IConciliaExternaContabQueryReponse,
  ConciliaExternaContabMutationReponse,
  IConciliaExtContab,
  IActaConciliacion,
  IConciliaExtContabResumen,
  IConciliaExtContabDeudasPorEdades,
} from './../models/concilia-externa.model';
import { conciliaExternaContaAPI } from './../graphql/concilia-externa-conta-api';
import { Observable } from 'rxjs';
import { ApolloService } from '../../../shared/helpers/apollo.service';
import { PdfmakeService } from '../../../shared/helpers/pdfmake.service';
import { SelectItem } from 'primeng/api';
import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';
import { FormControl, FormGroup } from '@angular/forms';
import {
  getMonthName,
  getPreviousMonth,
} from '../../../shared/models/date-range';

@Injectable()
export class ConciliaExternaContaService {
  constructor(
    private datePipe: DatePipe,
    private _pdfMakeSvc: PdfmakeService,
    private _apollo: ApolloService
  ) {}

  fg = new FormGroup({
    division: new FormControl('0', {
      initialValueIsDefault: true,
    }),
    unidad: new FormControl('0', { initialValueIsDefault: true }),
    divisionOD: new FormControl('0', { initialValueIsDefault: true }),
    unidadOD: new FormControl('0', { initialValueIsDefault: true }),
    periodo: new FormControl(getPreviousMonth(new Date()), {
      initialValueIsDefault: true,
    }),
    periodoActual: new FormControl(false, { initialValueIsDefault: true }),
    usuarioEmisor: new FormControl(null, { initialValueIsDefault: true }),
    cargoEmisor: new FormControl('', { initialValueIsDefault: true }),
    usuarioReceptor: new FormControl(null, { initialValueIsDefault: true }),
    cargoReceptor: new FormControl('', { initialValueIsDefault: true }),
    usuarioSupervisor: new FormControl(null, { initialValueIsDefault: true }),
    cargoSupervisor: new FormControl('', { initialValueIsDefault: true }),
    nota: new FormControl('', { initialValueIsDefault: true }),
  });

  private _conciliaContabRowData: IConciliaExtContab[] = [];
  private _conciliaContabResumenRowData: IConciliaExtContabResumen[] = [];
  private _conciliaContabPorEdadesRowData: IConciliaExtContabDeudasPorEdades[] =
    [];
  private _actaConciliacionEmisorRowData: IActaConciliacion[] = [];
  private _actaConciliacionReceptorRowData: IActaConciliacion[] = [];
  private _diferenciasConciliacionRowData = [];
  private _centrosNoConciliadosRowData = [];
  private _ConciliacionEntreUnidadesData = [];
  private _ConciliacionEntreUnidadesEmisorRowData = [];
  private _ConciliacionEntreUnidadesReceptorRowData = [];

  private _actaConciliaUsuariosEmisorList: SelectItem[] = [];
  private _actaConciliaUsuariosReceptorList: SelectItem[] = [];
  private _actaConciliaUsuariosSupervisorList: SelectItem[] = [];

  private _totalEmisorDivision = 0;
  private _totalReceptorDivision = 0;
  private _totalDiferenciaDivision = 0;

  private _totalEmisorTipo = 0;
  private _totalReceptorTipo = 0;
  private _totalDiferenciaTipo = 0;

  set ConciliaContabRowData(data: IConciliaExtContab[]) {
    this._conciliaContabRowData = data;
  }

  get ConciliaContabRowData(): IConciliaExtContab[] {
    return this._conciliaContabRowData;
  }

  set ConciliaContabResumenRowData(data: IConciliaExtContabResumen[]) {
    this._conciliaContabResumenRowData = data;
  }

  get ConciliaContabResumenRowData(): IConciliaExtContabResumen[] {
    return this._conciliaContabResumenRowData;
  }

  set ConciliaContabDeudasPorEdadesRowData(
    data: IConciliaExtContabDeudasPorEdades[]
  ) {
    this._conciliaContabPorEdadesRowData = data;
  }

  get ConciliaContabDeudasPorEdadesRowData(): IConciliaExtContabDeudasPorEdades[] {
    return this._conciliaContabPorEdadesRowData;
  }

  set ActaConciliacionEmisorRowData(data: any) {
    this._actaConciliacionEmisorRowData = data;
  }

  get ActaConciliacionEmisorRowData() {
    return this._actaConciliacionEmisorRowData;
  }

  set ActaConciliacionReceptorRowData(data: any) {
    this._actaConciliacionReceptorRowData = data;
  }

  get ActaConciliacionReceptorRowData() {
    return this._actaConciliacionReceptorRowData;
  }

  set DiferenciasConciliacionRowData(data: any) {
    this._diferenciasConciliacionRowData = data;
  }

  get DiferenciasConciliacionRowData() {
    return this._diferenciasConciliacionRowData;
  }

  set CentrosNoConciliadosRowData(data: any) {
    this._centrosNoConciliadosRowData = data;
  }

  get CentrosNoConciliadosRowData() {
    return this._centrosNoConciliadosRowData;
  }

  set ConciliacionEntreUnidadesData(data: any) {
    this._ConciliacionEntreUnidadesData = data;
  }

  get ConciliacionEntreUnidadesData() {
    return this._ConciliacionEntreUnidadesData;
  }

  set ConciliacionEntreUnidadesEmisorRowData(data: any) {
    this._ConciliacionEntreUnidadesEmisorRowData = data;
  }

  get ConciliacionEntreUnidadesEmisorRowData() {
    return this._ConciliacionEntreUnidadesEmisorRowData;
  }

  set ConciliacionEntreUnidadesReceptorRowData(data: any) {
    this._ConciliacionEntreUnidadesReceptorRowData = data;
  }

  get ConciliacionEntreUnidadesReceptorRowData() {
    return this._ConciliacionEntreUnidadesReceptorRowData;
  }

  set ActaConciliacionUsuariosEmisorList(data: SelectItem[]) {
    this._actaConciliaUsuariosEmisorList = data;
  }

  get ActaConciliacionUsuariosEmisorList(): SelectItem[] {
    return this._actaConciliaUsuariosEmisorList;
  }

  set ActaConciliacionUsuariosReceptorList(data) {
    this._actaConciliaUsuariosReceptorList = data;
  }

  get ActaConciliacionUsuariosReceptorList() {
    return this._actaConciliaUsuariosReceptorList;
  }

  set ActaConciliacionUsuariosSupervisorList(data) {
    this._actaConciliaUsuariosSupervisorList = data;
  }

  get ActaConciliacionUsuariosSupervisorList() {
    return this._actaConciliaUsuariosSupervisorList;
  }

  public calculaConciliacion(): Observable<IConciliaExternaContabQueryReponse> {
    const controls = this.fg.controls;

    const payload = {
      Annio: +moment(controls['periodo'].value).format('YYYY'),
      Mes: +moment(controls['periodo'].value).format('MM'),
      MesActual: controls['periodoActual'].value,
      Division: +controls['division'].value.IdDivision || 0,
      Unidad: +controls['unidad'].value.IdUnidad || 0,
      DivisionOD: +controls['divisionOD'].value.IdDivision || 0,
      UnidadOD: +controls['unidadOD'].value.IdUnidad || 0,
    };

    return new Observable<IConciliaExternaContabQueryReponse>(subscriber => {
      this._apollo
        .watchQuery<IConciliaExternaContabQueryReponse>(
          conciliaExternaContaAPI.conciliacion,
          {
            conciliaExternaInput: payload,
          }
        )
        .subscribe({
          next: res => {
            subscriber.next(res);
          },
          error: err => {
            subscriber.error(err.message || err);
          },
        });
    });
  }

  public calculaConciliacionResumen(): Observable<IConciliaExternaContabQueryReponse> {
    const controls = this.fg.controls;

    const payload = {
      annio: +moment(controls['periodo'].value).format('YYYY'),
      mes: +moment(controls['periodo'].value).format('MM'),
      mesActual: controls['periodoActual'].value,
    };

    return new Observable<IConciliaExternaContabQueryReponse>(subscriber => {
      this._apollo
        .watchQuery<IConciliaExternaContabQueryReponse>(
          conciliaExternaContaAPI.conciliacionResumen,
          payload
        )
        .subscribe({
          next: res => {
            subscriber.next(res);
          },
          error: err => {
            subscriber.error(err.message || err);
          },
        });
    });
  }

  public calculaConciliacionDeudasPorEdades(): Observable<IConciliaExternaContabQueryReponse> {
    const controls = this.fg.controls;

    const payload = {
      annio: +moment(controls['periodo'].value).format('YYYY'),
      mes: +moment(controls['periodo'].value).format('MM'),
      mesActual: controls['periodoActual'].value,
    };

    return new Observable<IConciliaExternaContabQueryReponse>(subscriber => {
      this._apollo
        .watchQuery<IConciliaExternaContabQueryReponse>(
          conciliaExternaContaAPI.conciliacionPorEdades,
          payload
        )
        .subscribe({
          next: res => {
            subscriber.next(res);
          },
          error: err => {
            subscriber.error(err.message || err);
          },
        });
    });
  }

  public getDatosConciliacion(): Observable<IConciliaExternaContabQueryReponse> {
    const payload = this.fg.controls;

    return new Observable<IConciliaExternaContabQueryReponse>(subscriber => {
      this._apollo
        .watchQuery<IConciliaExternaContabQueryReponse>(
          conciliaExternaContaAPI.datosConciliacion,
          {
            anno: +moment(payload['periodo'].value).format('YYYY'),
            mes: +moment(payload['periodo'].value).format('MM'),
          }
        )
        .subscribe({
          next: res => {
            subscriber.next(res);
          },
          error: err => {
            subscriber.error(err.message || err);
          },
        });
    });
  }

  public iniciarConciliacion(): Observable<ConciliaExternaContabMutationReponse> {
    const payload = this.fg.controls;
    return new Observable<ConciliaExternaContabMutationReponse>(subscriber => {
      this._apollo
        .mutation<ConciliaExternaContabMutationReponse>(
          conciliaExternaContaAPI.inicializarConciliacion,
          {
            annio: +moment(payload['periodo'].value).format('YYYY'),
            mes: +moment(payload['periodo'].value).format('MM'),
          },
          ['DatosConciliacion']
        )
        .subscribe({
          next: res => {
            subscriber.next(res);
          },
          error: err => {
            subscriber.error(err.message || err);
          },
        });
    });
  }

  public cerrarConciliacion(): Observable<ConciliaExternaContabMutationReponse> {
    const payload = this.fg.controls;
    return new Observable<ConciliaExternaContabMutationReponse>(subscriber => {
      this._apollo
        .mutation<ConciliaExternaContabMutationReponse>(
          conciliaExternaContaAPI.cerrarConciliacion,
          {
            anno: +moment(payload['periodo'].value).format('YYYY'),
            mes: +moment(payload['periodo'].value).format('MM'),
          }
        )
        .subscribe({
          next: res => {
            subscriber.next(res);
          },
          error: err => {
            subscriber.error(err.message || err);
          },
        });
    });
  }

  public reabrirConciliacion(): Observable<ConciliaExternaContabMutationReponse> {
    const payload = this.fg.controls;
    return new Observable<ConciliaExternaContabMutationReponse>(subscriber => {
      this._apollo
        .mutation<ConciliaExternaContabMutationReponse>(
          conciliaExternaContaAPI.reabrirConciliacion,
          {
            anno: +moment(payload['periodo'].value).format('YYYY'),
            mes: +moment(payload['periodo'].value).format('MM'),
          }
        )
        .subscribe({
          next: res => {
            subscriber.next(res);
          },
          error: err => {
            subscriber.error(err.message || err);
          },
        });
    });
  }

  public diferenciasConciliacion(): Observable<IConciliaExternaContabQueryReponse> {
    const payload = this.fg.controls;
    return new Observable<IConciliaExternaContabQueryReponse>(subscriber => {
      this._apollo
        .query<IConciliaExternaContabQueryReponse>(
          conciliaExternaContaAPI.diferenciasConciliacion,
          {
            annio: +moment(payload['periodo'].value).format('YYYY'),
            mes: +moment(payload['periodo'].value).format('MM'),
          }
        )
        .subscribe({
          next: res => {
            subscriber.next(res);
          },
          error: err => {
            subscriber.error(err.message || err);
          },
        });
    });
  }

  public centrosNoConciliados(): Observable<IConciliaExternaContabQueryReponse> {
    const payload = this.fg.controls;
    return new Observable<IConciliaExternaContabQueryReponse>(subscriber => {
      this._apollo
        .query<IConciliaExternaContabQueryReponse>(
          conciliaExternaContaAPI.centrosNoConciliados,
          {
            annio: +moment(payload['periodo'].value).format('YYYY'),
            mes: +moment(payload['periodo'].value).format('MM'),
          }
        )
        .subscribe({
          next: res => {
            subscriber.next(res);
          },
          error: err => {
            subscriber.error(err.message || err);
          },
        });
    });
  }

  public conciliacionEntreUnidadesEmisor(): Observable<IConciliaExternaContabQueryReponse> {
    const payload = this.fg.controls;
    return new Observable<IConciliaExternaContabQueryReponse>(subscriber => {
      this._apollo
        .query<IConciliaExternaContabQueryReponse>(
          conciliaExternaContaAPI.conciliacionEntreUnidades,
          {
            annio: +moment(payload['periodo'].value).format('YYYY'),
            mes: +moment(payload['periodo'].value).format('MM'),
            unidad: +payload['unidad'].value.IdUnidad || 0,
            unidadOD: +payload['unidadOD'].value.IdUnidad || 0,
          }
        )
        .subscribe({
          next: res => {
            subscriber.next(res);
          },
          error: err => {
            subscriber.error(err.message || err);
          },
        });
    });
  }

  public conciliacionEntreUnidadesReceptor(): Observable<IConciliaExternaContabQueryReponse> {
    const payload = this.fg.controls;
    return new Observable<IConciliaExternaContabQueryReponse>(subscriber => {
      this._apollo
        .query<IConciliaExternaContabQueryReponse>(
          conciliaExternaContaAPI.conciliacionEntreUnidades,
          {
            annio: +moment(payload['periodo'].value).format('YYYY'),
            mes: +moment(payload['periodo'].value).format('MM'),
            unidad: +payload['unidadOD'].value.IdUnidad || 0,
            unidadOD: +payload['unidad'].value.IdUnidad || 0,
          }
        )
        .subscribe({
          next: res => {
            subscriber.next(res);
          },
          error: err => {
            subscriber.error(err.message || err);
          },
        });
    });
  }

  // acta de conciliacion
  private _getPeriodoConciliacion(_alignment = 'center') {
    return {
      columns: [
        {
          text: `PERIODO A CONCILIAR: ${this._getPeriodo()}`,
          style: 'bold',
          alignment: _alignment,
          margin: [0, 10, 0, 10],
        },
      ],
    };
  }

  private _getDatosEmisorActa() {
    const emisor = this.fg.get('unidad')?.value
      ? this.fg.get('unidad')?.value?.Nombre +
        ' (' +
        this.fg.get('unidad')?.value?.IdDivision +
        ')'
      : '';

    const receptor = this.fg.get('unidadOD')?.value
      ? this.fg.get('unidadOD')?.value?.Nombre +
        ' (' +
        this.fg.get('unidadOD')?.value?.IdDivision +
        ')'
      : '';

    return {
      columns: [
        [
          {
            text: `EMISOR:      ${emisor}`,
            style: 'bold',
          },
          {
            text: `RECEPTOR: ${receptor}`,
            style: 'bold',
            margin: [0, 0, 0, 10],
          },
        ],
        [
          {
            text: 'Cuenta: 135/0040',
            style: 'bold',
            alignment: 'right',
          },
          {
            text: 'Cuenta: 405/0040',
            style: 'bold',
            alignment: 'right',
            margin: [0, 0, 0, 20],
          },
        ],
      ],
    };
  }

  private _getDatosReceptorActa() {
    const emisor = this.fg.get('unidadOD')?.value
      ? this.fg.get('unidadOD')?.value?.Nombre +
        ' (' +
        this.fg.get('unidadOD')?.value?.IdDivision +
        ')'
      : '';
    const receptor = this.fg.get('unidad')?.value
      ? this.fg.get('unidad')?.value?.Nombre +
        ' (' +
        this.fg.get('unidad')?.value?.IdDivision +
        ')'
      : '';

    return {
      columns: [
        [
          {
            text: `EMISOR:      ${emisor}`,
            style: 'bold',
          },
          {
            text: `RECEPTOR: ${receptor}`,
            style: 'bold',
            margin: [0, 0, 0, 10],
          },
        ],
        [
          {
            text: 'Cuenta: 135/0040',
            style: 'bold',
            alignment: 'right',
          },
          {
            text: 'Cuenta: 405/0040',
            style: 'bold',
            alignment: 'right',
            margin: [0, 0, 0, 20],
          },
        ],
      ],
    };
  }

  private async _getActaConciliacionEmisor() {
    return {
      table: {
        headerRows: 1,
        widths: ['*', 80, 80, 80],
        body: [
          [
            {
              text: 'DETALLE',
              style: 'bold',
            },
            {
              text: 'EMISOR',
              style: 'bold',
              alignment: 'right',
            },
            {
              text: 'RECEPTOR',
              style: 'bold',
              alignment: 'right',
            },
            {
              text: 'DIFERENCIA',
              style: 'bold',
              alignment: 'right',
            },
          ],
          ...this.ActaConciliacionEmisorRowData.map(
            (item: IActaConciliacion) => {
              return [
                item.Detalle,
                {
                  text: numberFormatter.format(item.SaldoEmisor),
                  alignment: 'right',
                },
                {
                  text: numberFormatter.format(item.SaldoReceptor),
                  alignment: 'right',
                },
                {
                  text: numberFormatter.format(item.Diferencia),
                  alignment: 'right',
                },
              ];
            }
          ),
        ],
      },
    };
  }

  private async _getActaConciliacionReceptor() {
    return {
      table: {
        headerRows: 1,
        widths: ['*', 80, 80, 80],
        body: [
          [
            {
              text: 'DETALLE',
              style: 'bold',
            },
            {
              text: 'EMISOR',
              style: 'bold',
              alignment: 'right',
            },
            {
              text: 'RECEPTOR',
              style: 'bold',
              alignment: 'right',
            },
            {
              text: 'DIFERENCIA',
              style: 'bold',
              alignment: 'right',
            },
          ],
          ...this.ActaConciliacionReceptorRowData.map(
            (item: IActaConciliacion) => {
              return [
                item.Detalle,
                {
                  text: numberFormatter.format(item.SaldoEmisor),
                  alignment: 'right',
                },
                {
                  text: numberFormatter.format(item.SaldoReceptor),
                  alignment: 'right',
                },
                {
                  text: numberFormatter.format(item.Diferencia),
                  alignment: 'right',
                },
              ];
            }
          ),
        ],
      },
    };
  }

  private _getPieDeFirmaEmisor() {
    return {
      columns: [
        [
          {
            text: 'Por el emisor:',
            style: 'bold',
            margin: [0, 40, 0, 0],
          },
          {
            text: `Nombre y Apellidos: ${
              this.fg.get('usuarioEmisor')?.value?.Empleado || ''
            }`,
            margin: [0, 10, 0, 0],
          },
          {
            text: `Cargo:                         ${this.fg.controls['cargoEmisor'].value}`,
            margin: [0, 10, 0, 0],
          },
          {
            text: `Firma:                         _______________________`,
            margin: [0, 10, 0, 0],
          },
        ],
        [
          {
            text: 'Por el Receptor:',
            style: 'bold',
            margin: [0, 40, 0, 0],
          },
          {
            text: `Nombre y Apellidos: ${
              this.fg.get('usuarioReceptor')?.value?.Empleado || ''
            }`,
            margin: [0, 10, 0, 0],
          },
          {
            text: `Cargo:                         ${this.fg.controls['cargoReceptor'].value}`,
            margin: [0, 10, 0, 0],
          },
          {
            text: `Firma:                         _______________________`,
            margin: [0, 10, 0, 0],
          },
        ],
      ],
    };
  }

  private _getPieDeFirmaReceptor() {
    return {
      columns: [
        [
          {
            text: 'Por el emisor:',
            style: 'bold',
            margin: [0, 40, 0, 0],
          },
          {
            text: `Nombre y Apellidos: ${
              this.fg.get('usuarioReceptor')?.value?.Empleado || ''
            }`,
            margin: [0, 10, 0, 0],
          },
          {
            text: `Cargo:                         ${this.fg.controls['cargoReceptor'].value}`,
            margin: [0, 10, 0, 0],
          },
          {
            text: `Firma:                         _______________________`,
            margin: [0, 10, 0, 0],
          },
        ],
        [
          {
            text: 'Por el Receptor:',
            style: 'bold',
            margin: [0, 40, 0, 0],
          },
          {
            text: `Nombre y Apellidos: ${
              this.fg.get('usuarioEmisor')?.value?.Empleado || ''
            }`,
            margin: [0, 10, 0, 0],
          },
          {
            text: `Cargo:                         ${this.fg.controls['cargoEmisor'].value}`,
            margin: [0, 10, 0, 0],
          },
          {
            text: `Firma:                         _______________________`,
            margin: [0, 10, 0, 0],
          },
        ],
      ],
    };
  }

  private _getPieDeFirmaSupervisor() {
    return {
      columns: [
        [
          {
            text: 'Por el supervisor:',
            style: 'bold',
            margin: [150, 40, 0, 0],
          },
          {
            text: `Nombre y Apellidos: ${
              this.fg.get('usuarioSupervisor')?.value?.Empleado || ''
            }`,
            margin: [150, 10, 0, 0],
          },
          {
            text: `Cargo:                         ${this.fg.controls['cargoSupervisor'].value}`,
            margin: [150, 10, 0, 0],
          },
          {
            text: `Firma:                         _______________________`,
            margin: [150, 10, 0, 0],
          },
        ],
      ],
    };
  }

  private _getNota() {
    return {
      columns: [
        [
          {
            text: 'Observaciones:',
            style: 'bold',
            margin: [0, 20, 0, 10],
            decoration: 'underline',
          },
          {
            text: this.fg.controls['nota'].value
              ? this.fg.controls['nota'].value
              : '',
          },
        ],
      ],
    };
  }

  private _getPeriodo() {
    return (
      getMonthName(+moment(this.fg.get('periodo')?.value).format('MM')) +
      '/' +
      moment(this.fg.get('periodo')?.value).format('YYYY') +
      (this.fg.get('periodoActual')?.value ? ' (Mes)' : '')
    );
  }

  // reportes de la conciliacion
  public async getPdfDefinition(reportName: string, selectedTab: number) {
    switch (selectedTab) {
      case 0: // Conciliación Contabilidad
        return {
          info: {
            title:
              'Reporte de Conciliación Externa por la Contabilidad | SISCO',
          },
          pageSize: 'LETTER',
          pageOrientation: 'landscape',
          content: [
            await this._pdfMakeSvc.getHeaderDefinition(reportName),
            await this._getEmisorReceptorReporte(),
            await this._getPeriodoConciliacion('left'),
            await this._getConciliaContab(),
          ],
          defaultStyle: {
            fontSize: 9,
          },
          styles: {
            tableHeader: {
              bold: true,
            },
          },
        };
      case 1: // Acta Emisor
        return {
          info: {
            title: 'Acta de Conciliación Externa por la Contabilidad | SISCO',
          },
          pageSize: 'LETTER',
          content: [
            await this._pdfMakeSvc.getHeaderDefinition(reportName),
            this._getPeriodoConciliacion(),
            this._getDatosEmisorActa(),
            await this._getActaConciliacionEmisor(),
            this._getPieDeFirmaEmisor(),
            this._getPieDeFirmaSupervisor(),
            this._getNota(),
          ],
          defaultStyle: {
            fontSize: 10,
            lineHeight: 1.3,
          },
          styles: {
            bold: {
              bold: true,
            },
          },
        };
      case 2: // Acta Receptor
        return {
          info: {
            title: 'Acta de Conciliación Externa por la Contabilidad | SISCO',
          },
          pageSize: 'LETTER',
          content: [
            await this._pdfMakeSvc.getHeaderDefinition(reportName),
            this._getPeriodoConciliacion(),
            this._getDatosReceptorActa(),
            await this._getActaConciliacionReceptor(),
            this._getPieDeFirmaReceptor(),
            this._getPieDeFirmaSupervisor(),
            this._getNota(),
          ],
          defaultStyle: {
            fontSize: 10,
            lineHeight: 1.3,
          },
          styles: {
            bold: {
              bold: true,
            },
          },
        };
      case 10: // Deudas Resumen
        return {
          info: {
            title:
              'Deudas Resumen en Conciliación Externa por la Contabilidad | SISCO',
          },
          pageSize: 'LETTER',
          pageOrientation: 'landscape',
          content: [
            await this._pdfMakeSvc.getHeaderDefinition(reportName),
            {
              columns: [
                {
                  text: `PERIODO: ${this._getPeriodo()}`,
                  bold: true,
                  margin: [0, 10, 0, 10],
                },
              ],
            },
            await this._getConciliaContabResumen(),
          ],
          footer: (page: string, pages: string) => {
            return this._pdfMakeSvc.getFooterDefinition(page, pages);
          },
          defaultStyle: {
            fontSize: 9,
          },
          styles: {
            tableHeader: {
              bold: true,
            },
          },
        };
      case 11: // Deudas Por Edades
        return {
          info: {
            title:
              'Deudas Por Edades en Conciliación Externa por la Contabilidad | SISCO',
          },
          pageSize: 'LETTER',
          pageOrientation: 'landscape',
          content: [
            await this._pdfMakeSvc.getHeaderDefinition(reportName),
            {
              columns: [
                {
                  text: `PERIODO: ${this._getPeriodo()}`,
                  bold: true,
                  margin: [0, 10, 0, 10],
                },
              ],
            },
            await this._getConciliaContabDeudasPorEdades(),
          ],
          footer: (page: string, pages: string) => {
            return this._pdfMakeSvc.getFooterDefinition(page, pages);
          },
          defaultStyle: {
            fontSize: 9,
          },
          styles: {
            tableHeader: {
              bold: true,
            },
          },
        };
      case 15: // Diferencias en la conciliación
        return {
          info: {
            title:
              'Diferencias en la Conciliación Externa por la Contabilidad | SISCO',
          },
          pageSize: 'LETTER',
          pageOrientation: 'landscape',
          content: [
            await this._pdfMakeSvc.getHeaderDefinition(reportName),
            await this._getDiferenciasConciliacion(),
          ],
          defaultStyle: {
            fontSize: 9,
          },
          styles: {
            tableHeader: {
              bold: true,
            },
          },
        };
      case 16: // Centros que no conciliaron
        return {
          info: {
            title:
              'Centro que no han realizado la Conciliación Externa por la Contabilidad | SISCO',
          },
          pageSize: 'LETTER',
          content: [
            await this._pdfMakeSvc.getHeaderDefinition(reportName),
            await this._centrosNoConciliados(),
          ],
          defaultStyle: {
            fontSize: 11,
          },
          styles: {
            tableHeader: {
              bold: true,
            },
          },
        };
    }
  }

  private async _getEmisorReceptorReporte() {
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
              this.fg.get('division')?.value?.IdDivision
                ? this.fg.get('division')?.value?.IdDivision +
                  '-' +
                  this.fg.get('division')?.value?.Division
                : '--TODAS--'
            }`,
            margin: [0, 0, 0, 5],
          },
          {
            text: `Unidad:   ${
              this.fg.get('unidad')?.value?.Nombre || '--TODAS--'
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
              this.fg.get('divisionOD')?.value?.IdDivision
                ? this.fg.get('divisionOD')?.value?.IdDivision +
                  '-' +
                  this.fg.get('divisionOD')?.value?.Division
                : '--TODAS--'
            }`,
            margin: [0, 0, 0, 5],
          },
          {
            text: `Unidad:   ${
              this.fg.get('unidadOD')?.value?.Nombre || '--TODAS--'
            }`,
            margin: [0, 0, 0, 5],
          },
        ],
      ],
    };
  }

  private async _getConciliaContab(): Promise<any> {
    const definition: any[] = [];

    const divisionesEmisor = uniq([
      ...this.ConciliaContabRowData.map(c => c.DivisionEmisor),
    ]);

    divisionesEmisor.forEach(div => {
      this._totalEmisorDivision = 0;
      this._totalReceptorDivision = 0;
      this._totalDiferenciaDivision = 0;

      definition.push({
        text: 'División Emisor: ' + div,
        bold: true,
        decoration: 'underline',
        margin: [0, 10, 0, 0],
      });

      const tipos = sortBy(
        uniq([
          ...this.ConciliaContabRowData.filter(
            f => f.DivisionEmisor === div
          ).map(c => c.Tipo),
        ])
      );

      tipos.forEach(tipo => {
        this._totalEmisorTipo = 0;
        this._totalReceptorTipo = 0;
        this._totalDiferenciaTipo = 0;

        definition.push({
          text: 'Tipo: ' + tipo,
          bold: true,
          italics: true,
          margin: [0, 10, 0, 0],
        });

        const annios = sortBy(
          uniq([
            ...this.ConciliaContabRowData.filter(
              f => f.DivisionEmisor === div && f.Tipo === tipo
            ).map(c => {
              const _fecha = String(
                c.FechaEmision ? c.FechaEmision : c.FechaRecepcion
              ).split('/');

              return moment(`${_fecha[2]}-${_fecha[1]}-${_fecha[0]}`).format(
                'YYYY'
              );
            }),
          ])
        );

        annios.forEach(annio => {
          definition.push({
            text: 'Año: ' + annio,
            bold: true,
            margin: [0, 10, 0, 5],
          });

          const _filteredData = [
            ...this.ConciliaContabRowData.filter(f => {
              const _fecha = String(
                f.FechaEmision ? f.FechaEmision : f.FechaRecepcion
              ).split('/');

              if (
                f.DivisionEmisor === div &&
                f.Tipo === tipo &&
                moment(`${_fecha[2]}-${_fecha[1]}-${_fecha[0]}`).format(
                  'YYYY'
                ) === annio
              ) {
                return f;
              }
            }),
          ];

          definition.push(this._getConciliaContabTabla(_filteredData));
        });

        definition.push(this._getTotalesTipoTabla());
      });

      definition.push(this._getTotalesDivisionTabla());
    });

    return definition;
  }

  private _getConciliaContabTabla(data: IConciliaExtContab[]): object {
    let totalEmisor = 0;
    let totalReceptor = 0;
    let totalDiferencia = 0;

    const returnValue = {
      table: {
        widths: [70, 30, 30, 50, 80, 5, 40, 40, 40, 50, 80, 80],
        body: [
          [
            {
              text: 'Documento',
              style: 'tableHeader',
            },
            {
              text: 'Cuenta Emisor',
              style: 'tableHeader',
            },
            {
              text: 'Emisor',
              style: 'tableHeader',
            },
            {
              text: 'Fecha Emision',
              style: 'tableHeader',
            },
            {
              text: 'Importe Emisor',
              style: 'tableHeader',
              alignment: 'right',
            },
            {
              text: '|',
              style: 'tableHeader',
            },
            {
              text: 'Cuenta Receptor',
              style: 'tableHeader',
            },
            {
              text: 'División Receptor',
              style: 'tableHeader',
            },
            {
              text: 'Receptor',
              style: 'tableHeader',
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
          ...data.map((item: IConciliaExtContab) => {
            totalEmisor += item.ValorEmisor;
            totalReceptor += item.ValorReceptor;
            totalDiferencia += item.DiferenciaImporte;

            this._totalEmisorTipo += item.ValorEmisor;
            this._totalReceptorTipo += item.ValorReceptor;
            this._totalDiferenciaTipo += item.DiferenciaImporte;

            this._totalEmisorDivision += item.ValorEmisor;
            this._totalReceptorDivision += item.ValorReceptor;
            this._totalDiferenciaDivision += item.DiferenciaImporte;

            return [
              item.Documento,
              item.CuentaEmisor,
              item.Emisor,
              item.FechaEmision,
              {
                text: numberFormatter.format(item.ValorEmisor),
                alignment: 'right',
              },
              '|',
              item.CuentaReceptor,
              item.DivisionReceptor,
              item.Receptor,
              item.FechaRecepcion,
              {
                text: numberFormatter.format(item.ValorReceptor),
                alignment: 'right',
              },
              {
                text: numberFormatter.format(item.DiferenciaImporte),
                alignment: 'right',
              },
            ];
          }),
          [
            { text: 'TOTAL AÑO', bold: true },
            {},
            {},
            {},
            {
              text: numberFormatter.format(totalEmisor),
              bold: true,
              alignment: 'right',
            },
            {},
            {},
            {},
            {},
            {},
            {
              text: numberFormatter.format(totalReceptor),
              bold: true,
              alignment: 'right',
            },
            {
              text: numberFormatter.format(totalDiferencia),
              bold: true,
              alignment: 'right',
            },
          ],
        ],
      },
    };

    return returnValue;
  }

  private _getTotalesTipoTabla(): object {
    const returnValue = {
      table: {
        margin: [0, 10, 0, 0],
        widths: [70, 30, 30, 50, 80, 5, 40, 40, 40, 50, 80, 80],
        body: [
          [
            { text: 'TOTAL TIPO', bold: true },
            {},
            {},
            {},
            {
              text: numberFormatter.format(this._totalEmisorTipo),
              bold: true,
              alignment: 'right',
            },
            {},
            {},
            {},
            {},
            {},
            {
              text: numberFormatter.format(this._totalReceptorTipo),
              bold: true,
              alignment: 'right',
            },
            {
              text: numberFormatter.format(this._totalDiferenciaTipo),
              bold: true,
              alignment: 'right',
            },
          ],
        ],
      },
    };

    return returnValue;
  }

  private _getTotalesDivisionTabla(): object {
    const returnValue = {
      table: {
        margin: [0, 10, 0, 0],
        widths: [70, 30, 30, 50, 80, 5, 40, 40, 40, 50, 80, 80],
        body: [
          [
            { text: 'TOTAL DIVISION', bold: true },
            {},
            {},
            {},
            {
              text: numberFormatter.format(this._totalEmisorDivision),
              bold: true,
              alignment: 'right',
            },
            {},
            {},
            {},
            {},
            {},
            {
              text: numberFormatter.format(this._totalReceptorDivision),
              bold: true,
              alignment: 'right',
            },
            {
              text: numberFormatter.format(this._totalDiferenciaDivision),
              bold: true,
              alignment: 'right',
            },
          ],
        ],
      },
    };

    return returnValue;
  }

  private async _getConciliaContabResumen() {
    let totalEmisor = 0;
    let totalReceptor = 0;
    let totalDiferencia = 0;

    return {
      table: {
        headerRows: 1,
        widths: [200, 90, 200, 90, 90],
        body: [
          [
            {
              text: 'División Emisor',
              style: 'tableHeader',
            },
            {
              text: 'Importe Emisor',
              style: 'tableHeader',
              alignment: 'right',
            },
            {
              text: 'División Receptor',
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
          ...this.ConciliaContabResumenRowData.map(
            (item: IConciliaExtContabResumen) => {
              totalEmisor += item.ValorEmisor;
              totalReceptor += item.ValorReceptor;
              totalDiferencia += item.Diferencia;

              return [
                item.DivisionEmisor,
                {
                  text: numberFormatter.format(item.ValorEmisor),
                  alignment: 'right',
                },
                item.DivisionReceptor,
                {
                  text: numberFormatter.format(item.ValorReceptor),
                  alignment: 'right',
                },
                {
                  text: numberFormatter.format(item.Diferencia),
                  alignment: 'right',
                },
              ];
            }
          ),
          [
            { text: 'TOTAL', bold: true },
            {
              text: numberFormatter.format(totalEmisor),
              bold: true,
              alignment: 'right',
            },
            {},
            {
              text: numberFormatter.format(totalReceptor),
              bold: true,
              alignment: 'right',
            },
            {
              text: numberFormatter.format(totalDiferencia),
              bold: true,
              alignment: 'right',
            },
          ],
        ],
      },
    };
  }

  private async _getConciliaContabDeudasPorEdades() {
    const definition: any[] = [];

    const tipoOperaciones = uniq(
      this.ConciliaContabDeudasPorEdadesRowData.map(d => d.TipoOperacion)
    );

    tipoOperaciones.forEach(tipo => {
      definition.push({
        text: 'Tipo: ' + tipo,
        bold: true,
        margin: [0, 10, 0, 0],
      });

      const filteredData = this.ConciliaContabDeudasPorEdadesRowData.filter(
        f => f.TipoOperacion === tipo
      );

      definition.push(
        this._getConciliaContabDeudasPorEdadesTable(filteredData)
      );
    });

    return definition;
  }

  private _getConciliaContabDeudasPorEdadesTable(
    data: IConciliaExtContabDeudasPorEdades[]
  ): object {
    let totalValor = 0;
    let totalDe0A30 = 0;
    let totalDe30A60 = 0;
    let totalDe60A90 = 0;
    let totalDe90A365 = 0;
    let totalMasDe1Anio = 0;

    return {
      table: {
        headerRows: 1,
        widths: [160, 80, 80, 80, 80, 80, 80],
        body: [
          [
            {
              text: 'División',
              style: 'tableHeader',
            },
            {
              text: 'Valor',
              style: 'tableHeader',
              alignment: 'right',
            },
            {
              text: 'De 0 a 30',
              style: 'tableHeader',
              alignment: 'right',
            },
            {
              text: 'De 30 a 60',
              style: 'tableHeader',
              alignment: 'right',
            },
            {
              text: 'De 60 a 90',
              style: 'tableHeader',
              alignment: 'right',
            },
            {
              text: 'De 90 a 365',
              style: 'tableHeader',
              alignment: 'right',
            },
            {
              text: 'Más de 1 Año',
              style: 'tableHeader',
              alignment: 'right',
            },
          ],
          ...data.map((item: IConciliaExtContabDeudasPorEdades) => {
            totalValor += item.Valor;
            totalDe0A30 += item.De0a30;
            totalDe30A60 += item.De30a60;
            totalDe60A90 += item.De60a90;
            totalDe90A365 += item.De90a365;
            totalMasDe1Anio += item.MasDe1Anno;

            return [
              item.Division,
              {
                text: numberFormatter.format(item.Valor),
                alignment: 'right',
              },
              {
                text: numberFormatter.format(item.De0a30),
                alignment: 'right',
              },
              {
                text: numberFormatter.format(item.De30a60),
                alignment: 'right',
              },
              {
                text: numberFormatter.format(item.De60a90),
                alignment: 'right',
              },
              {
                text: numberFormatter.format(item.De90a365),
                alignment: 'right',
              },
              {
                text: numberFormatter.format(item.MasDe1Anno),
                alignment: 'right',
              },
            ];
          }),
          [
            { text: 'TOTAL', bold: true },
            {
              text: numberFormatter.format(totalValor),
              bold: true,
              alignment: 'right',
            },
            {
              text: numberFormatter.format(totalDe0A30),
              bold: true,
              alignment: 'right',
            },
            {
              text: numberFormatter.format(totalDe30A60),
              bold: true,
              alignment: 'right',
            },
            {
              text: numberFormatter.format(totalDe60A90),
              bold: true,
              alignment: 'right',
            },
            {
              text: numberFormatter.format(totalDe90A365),
              bold: true,
              alignment: 'right',
            },
            {
              text: numberFormatter.format(totalMasDe1Anio),
              bold: true,
              alignment: 'right',
            },
          ],
        ],
      },
    };
  }

  private async _getDiferenciasConciliacion() {
    return {
      table: {
        headerRows: 1,
        widths: [
          'auto',
          'auto',
          'auto',
          'auto',
          50,
          'auto',
          'auto',
          'auto',
          'auto',
          'auto',
          'auto',
          50,
          'auto',
          'auto',
          'auto',
          'auto',
        ],
        body: [
          [
            {
              text: 'Tipo',
              style: 'tableHeader',
            },
            {
              text: 'Cuenta',
              style: 'tableHeader',
            },
            {
              text: 'Emisor',
              style: 'tableHeader',
            },
            {
              text: 'Emitido A',
              style: 'tableHeader',
            },
            {
              text: 'Docum.',
              style: 'tableHeader',
            },
            {
              text: 'Fecha',
              style: 'tableHeader',
            },
            {
              text: 'Valor',
              style: 'tableHeader',
            },
            {
              text: '|',
              style: 'tableHeader',
            },
            {
              text: 'Cuenta',
              style: 'tableHeader',
            },
            {
              text: 'Receptor',
              style: 'tableHeader',
            },
            {
              text: 'Recibido De',
              style: 'tableHeader',
            },
            {
              text: 'Docum.',
              style: 'tableHeader',
            },
            {
              text: 'Fecha',
              style: 'tableHeader',
            },
            {
              text: 'Valor',
              style: 'tableHeader',
            },
            {
              text: 'Diferencia',
              style: 'tableHeader',
            },
            {
              text: 'Recibido',
              style: 'tableHeader',
            },
          ],
          ...this.DiferenciasConciliacionRowData.data.map((item: any) => {
            return [
              item.Tipo,
              item.CuentaE,
              item.Emisor,
              item.EmitidoA,
              item.DocumentoE,
              this.datePipe.transform(item.FechaE, 'dd-MM-yyyy'),
              Number(item.ValorE).toFixed(2),
              '|',
              item.CuentaR,
              item.Receptor,
              item.RecibidoDe,
              item.DocumentoR,
              this.datePipe.transform(item.FechaR, 'dd/MM/yyyy'),
              Number(item.ValorR).toFixed(2),
              Number(item.DiferenciaImporte).toFixed(2),
              item.Recibido ? 'Sí' : 'No',
            ];
          }),
        ],
      },
    };
  }

  private async _centrosNoConciliados() {
    return {
      table: {
        headerRows: 1,
        widths: [100, 100],
        body: [
          [
            {
              text: 'Emisor',
              style: 'tableHeader',
            },
            {
              text: 'Receptor',
              style: 'tableHeader',
            },
          ],
          ...this.CentrosNoConciliadosRowData.data.map((item: any) => {
            return [item.Emisor, item.Receptor];
          }),
        ],
      },
    };
  }
}

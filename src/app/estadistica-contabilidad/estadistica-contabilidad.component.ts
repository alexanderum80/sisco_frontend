import { PdfmakeService } from './../shared/helpers/pdfmake.service';
import { IEstadisticaContabilidad } from './shared/models/estadistica-contabilidad.model';
import { ITableColumns } from './../shared/ui/prime-ng/table/table.model';
import { SweetalertService } from './../shared/helpers/sweetalert.service';
import { DivisionesService } from './../shared/services/divisiones.service';
import { SelectItem } from 'primeng/api';
import { EstadisticaContabilidadService } from './shared/services/estadistica-contabilidad.service';
import { FormGroup } from '@angular/forms';
import {
  Component,
  OnInit,
  AfterViewInit,
  AfterContentChecked,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import { cloneDeep, orderBy } from 'lodash';
import * as moment from 'moment';

@Component({
  selector: 'app-estadistica-contabilidad',
  templateUrl: './estadistica-contabilidad.component.html',
  styleUrls: ['./estadistica-contabilidad.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EstadisticaContabilidadComponent
  implements OnInit, AfterViewInit, AfterContentChecked
{
  fg: FormGroup;
  dataSource: IEstadisticaContabilidad[] = [];

  displayedColumns: ITableColumns[] = [
    { header: 'Centro', field: 'Centro', type: 'string' },
    { header: 'Consolidado', field: 'Consolidado', type: 'boolean' },
    {
      header: 'Fecha Actualización',
      field: 'FechaActualizacion',
      type: 'date',
      dateFormat: 'dd/MM/yyyy hh:mm:ss a',
    },
    { header: 'Fecha Inicio', field: 'FechaInicio', type: 'date' },
    { header: 'Fecha Fin', field: 'FechaFin', type: 'date' },
    {
      header: 'Comprobantes',
      field: 'Comprobantes',
      type: 'number',
      totalize: true,
    },
    {
      header: 'Traspasados',
      field: 'Traspasados',
      type: 'number',
      totalize: true,
    },
    {
      header: 'Sin Traspasar',
      field: 'SinTraspasar',
      type: 'number',
      totalize: true,
    },
    {
      header: 'Inconclusos',
      field: 'Inconclusos',
      type: 'number',
      totalize: true,
    },
    { header: 'Anulados', field: 'Anulados', type: 'number', totalize: true },
  ];

  divisionesValues: SelectItem[] = [];

  loading = false;

  constructor(
    private _estadisticaContaSvc: EstadisticaContabilidadService,
    private _divisionesSvc: DivisionesService,
    private _swalSvc: SweetalertService,
    private cd: ChangeDetectorRef,
    private _pdfMakeSvc: PdfmakeService
  ) {}

  ngOnInit(): void {
    this.fg = this._estadisticaContaSvc.fg;
    this.fg.reset();
  }

  ngAfterViewInit(): void {
    this._getDivisiones();

    this._subscribeToFgChange();
  }

  ngAfterContentChecked(): void {
    this.cd.detectChanges();
  }

  private _getDivisiones(): void {
    try {
      this._estadisticaContaSvc.subscription.push(
        this._divisionesSvc.getDivisionesByUsuario().subscribe({
          next: res => {
            const result = res.getAllDivisionesByUsuario;

            this.divisionesValues = result.map(d => {
              return {
                value: d.IdDivision,
                label: d.IdDivision + '-' + d.Division,
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

  private _subscribeToFgChange(): void {
    this._estadisticaContaSvc.subscription.push(
      this.fg.valueChanges.subscribe(() => {
        this.dataSource = [];
      })
    );
  }

  conciliar(): void {
    this.loading = true;
    this._estadisticaContaSvc.getEstadistica().subscribe({
      next: res => {
        this.loading = false;
        this.dataSource = cloneDeep(orderBy(res, ['IdDivision', 'IdCentro']));
      },
      error: err => {
        this.loading = false;
        this._swalSvc.error(err);
      },
    });
  }

  async reporte(): Promise<any> {
    try {
      const documentDefinitions = {
        info: {
          title: 'Información Estadística | SISCO',
        },
        pageSize: 'LETTER',
        pageOrientation: 'landscape',
        content: [
          await this._pdfMakeSvc.getHeaderDefinition(
            'Información Estadística de la Conciliación Contable'
          ),
          await this._estadisticaContaSvc.getDivision(
            this.fg.controls['idDivision'].value,
            this.divisionesValues
          ),
          await this._pdfMakeSvc.getPeriodoDefinition(
            +moment(this.fg.controls['periodo'].value).format('MM'),
            moment(this.fg.controls['periodo'].value).format('YYYY')
          ),
          await this._estadisticaContaSvc.getConciliacionDefinition(
            this.dataSource
          ),
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

      this._pdfMakeSvc.generatePdf(documentDefinitions);
    } catch (err: any) {
      this._swalSvc.error(err);
    }
  }
}

import { PdfmakeService } from './../shared/helpers/pdfmake.service';
import { ITableColumns } from './../shared/ui/prime-ng/table/table.model';
import { SweetalertService } from './../shared/helpers/sweetalert.service';
import { SelectItem } from 'primeng/api';
import {
  Component,
  OnInit,
  AfterViewInit,
  AfterContentChecked,
  ChangeDetectorRef,
} from '@angular/core';
import { cloneDeep, orderBy } from 'lodash';
import { ParteEstadisticaContabilidadService } from './shared/services/parte-estadistica-contabilidad.service';
import { IParteEstadisticaContabilidad } from './shared/models/parte-estadistica-contabilidad.model';
import { FormGroup } from '@angular/forms';
import { DivisionesService } from '../shared/services/divisiones.service';

@Component({
  selector: 'app-parte-estadistica-contabilidad',
  templateUrl: './parte-estadistica-contabilidad.component.html',
  styleUrls: ['./parte-estadistica-contabilidad.component.scss'],
})
export class ParteEstadisticaContabilidadComponent
  implements OnInit, AfterViewInit, AfterContentChecked
{
  fg: FormGroup;

  originalDataSource: IParteEstadisticaContabilidad[] = [];
  dataSource: IParteEstadisticaContabilidad[] = [];
  filteredDataSource: IParteEstadisticaContabilidad[] = [];

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
    { header: 'Conexión', field: 'Conexion', type: 'string' },
  ];

  divisionesValues: SelectItem[] = [];

  loading = true;

  constructor(
    private _parteEstadisticaContaSvc: ParteEstadisticaContabilidadService,
    private _divisionesSvc: DivisionesService,
    private _swalSvc: SweetalertService,
    private _pdfMakeSvc: PdfmakeService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.fg = this._parteEstadisticaContaSvc.fg;
    this.fg.reset();

    this._getDivisiones();
    this._conciliar();
  }

  ngAfterViewInit(): void {
    this._subscribeToFgChange();
  }

  ngAfterContentChecked(): void {
    this.cd.detectChanges();
  }

  private _getDivisiones(): void {
    try {
      this._parteEstadisticaContaSvc.subscription.push(
        this._divisionesSvc.getDivisiones().subscribe({
          next: res => {
            const result = res.getAllDivisiones;

            this.divisionesValues = result.map(d => {
              return {
                value: +d.IdDivision,
                label: d.IdDivision + '-' + d.Division,
              };
            });

            this.divisionesValues.unshift({
              value: 0,
              label: '-- TODAS LAS DIVISIONES --',
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

  private _conciliar(): void {
    this._parteEstadisticaContaSvc.getEstadistica().subscribe({
      next: res => {
        this.loading = false;
        this.originalDataSource = cloneDeep(
          orderBy(res, ['IdDivision', 'IdCentro'])
        );
        this.dataSource = cloneDeep(this.originalDataSource);
      },
      error: err => {
        this.loading = false;
        this._swalSvc.error(err);
      },
    });
  }

  private _subscribeToFgChange(): void {
    this._parteEstadisticaContaSvc.subscription.push(
      this.fg.controls['idDivision'].valueChanges.subscribe(idDivision => {
        this.dataSource = !idDivision
          ? cloneDeep(this.originalDataSource)
          : cloneDeep(
              this.originalDataSource.filter(f => f.IdDivision === idDivision)
            );
      })
    );
  }

  updateFilteredDatasource(data: IParteEstadisticaContabilidad[]): void {
    this.filteredDataSource = data;
  }

  async reporte(): Promise<any> {
    try {
      const documentDefinitions = {
        info: {
          title: 'Parte de la Información Estadística | SISCO',
        },
        pageSize: 'LETTER',
        pageOrientation: 'landscape',
        content: [
          await this._pdfMakeSvc.getHeaderDefinition(
            'Parte de la Información Estadística de la Contabilidad'
          ),
          await this._parteEstadisticaContaSvc.getConciliacionDefinition(
            this.filteredDataSource
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

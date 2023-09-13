import { ConciliaUhService } from './shared/services/concilia-uh.service';
import { cloneDeep } from 'lodash';
import { SweetalertService } from './../shared/helpers/sweetalert.service';
import { PdfmakeService } from './../shared/helpers/pdfmake.service';
import { ClasificadorEntidadesService } from './../clasificador-entidades/shared/services/clasificador-entidades.service';
import { TipoEntidadesService } from './../tipo-entidades/shared/services/tipo-entidades.service';
import { UnidadesService } from './../unidades/shared/services/unidades.service';
import { FormGroup } from '@angular/forms';
import { ConciliaUH } from './shared/models/concilia-uh.model';
import { SelectItem } from 'primeng/api';
import { ITableColumns } from './../shared/ui/prime-ng/table/table.model';
import {
  Component,
  OnInit,
  ChangeDetectorRef,
  AfterViewInit,
  OnDestroy,
  AfterContentChecked,
} from '@angular/core';
import * as moment from 'moment';
import { IUnidades } from '../unidades/shared/models/unidades.model';

@Component({
  selector: 'app-concilia-uh',
  templateUrl: './concilia-uh.component.html',
  styleUrls: ['./concilia-uh.component.scss'],
})
export class ConciliaUhComponent
  implements OnInit, AfterViewInit, AfterContentChecked, OnDestroy
{
  displayedColumnsInventario: ITableColumns[] = [
    { header: 'Cuenta', field: 'Cuenta', type: 'string' },
    { header: 'SubCuenta', field: 'SubCuenta', type: 'string' },
    { header: 'Análisis 1', field: 'Analisis1', type: 'string' },
    { header: 'Análisis 2', field: 'Analisis2', type: 'string' },
    { header: 'Análisis 3', field: 'Analisis3', type: 'string' },
    { header: 'Análisis 4', field: 'Analisis4', type: 'string' },
    { header: 'Análisis 5', field: 'Analisis5', type: 'string' },
    {
      header: 'Saldo Inventario',
      field: 'SaldoUH',
      type: 'decimal',
      totalize: true,
    },
    {
      header: 'Saldo Rodas',
      field: 'SaldoRodas',
      type: 'decimal',
      totalize: true,
    },
    {
      header: 'Diferencia',
      field: 'Diferencia',
      type: 'decimal',
      totalize: true,
    },
  ];

  displayedColumnsDesgaste: ITableColumns[] = [
    { header: 'Cuenta', field: 'Cuenta', type: 'string' },
    { header: 'SubCuenta', field: 'SubCuenta', type: 'string' },
    { header: 'Análisis 1', field: 'Analisis1', type: 'string' },
    { header: 'Análisis 2', field: 'Analisis2', type: 'string' },
    { header: 'Análisis 3', field: 'Analisis3', type: 'string' },
    { header: 'Análisis 4', field: 'Analisis4', type: 'string' },
    { header: 'Análisis 5', field: 'Analisis5', type: 'string' },
    {
      header: 'Saldo Desgaste',
      field: 'SaldoUH',
      type: 'decimal',
      totalize: true,
    },
    {
      header: 'Saldo Rodas',
      field: 'SaldoRodas',
      type: 'decimal',
      totalize: true,
    },
    {
      header: 'Diferencia',
      field: 'Diferencia',
      type: 'decimal',
      totalize: true,
    },
  ];

  centrosValues: SelectItem[] = [];
  tipoEntidadValues: SelectItem[] = [];

  dataSourceConciliacion: ConciliaUH[] = [];
  dataSourceInventario: ConciliaUH[] = [];
  dataSourceDesgaste: ConciliaUH[] = [];

  totalInvAft = 0;
  totalInvRodas = 0;
  totalInvDif = 0;

  totalDepAft = 0;
  totalDepRodas = 0;
  totalDepDif = 0;

  loading = false;
  selectedTabViewIndex = 0;

  tipoCentrosValues: SelectItem[] = [
    { value: '0', label: 'Centro' },
    { value: '2', label: 'Consolidado' },
  ];

  fg: FormGroup;

  myDatepicker: any;

  constructor(
    private _unidadesSvc: UnidadesService,
    private _tipoEntidadesSvc: TipoEntidadesService,
    private _clasifEntidadesSvc: ClasificadorEntidadesService,
    private _conciliaUhSvc: ConciliaUhService,
    private _pdfMakeSvc: PdfmakeService,
    private _changeDedectionRef: ChangeDetectorRef,
    private _swalSvc: SweetalertService
  ) {}

  ngOnInit(): void {
    this.fg = this._conciliaUhSvc.fg;
    this.fg.reset();

    this._subscribeToFgValueChanges();
  }

  ngAfterViewInit(): void {
    this._getUnidades();
    this._getTipoEntidades();
  }

  ngAfterContentChecked(): void {
    this._changeDedectionRef.detectChanges();
  }

  ngOnDestroy(): void {
    this._conciliaUhSvc.dispose();
  }

  private _subscribeToFgValueChanges(): void {
    this._conciliaUhSvc.subscription.push(
      this.fg.valueChanges.subscribe(() => {
        this._inicializarDatos();
      })
    );

    // IdCentro
    this._conciliaUhSvc.subscription.push(
      this.fg.controls['idCentro'].valueChanges.subscribe(value => {
        if (value) {
          this._updateTipoEntidad(value);
        } else {
          this.fg.controls['tipoEntidad'].setValue('');
        }
      })
    );
  }

  private _inicializarDatos(): void {
    this.dataSourceConciliacion = [];
    this.dataSourceInventario = [];
    this.dataSourceDesgaste = [];
  }

  private _getUnidades(): void {
    try {
      this._conciliaUhSvc.subscription.push(
        this._unidadesSvc.getAllUnidadesByUsuario().subscribe({
          next: res => {
            const data = res.getAllUnidadesByUsuario;

            this.centrosValues = data.map((u: IUnidades) => {
              return {
                value: u.IdUnidad,
                label: u.Nombre,
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

  private _getTipoEntidades(): void {
    try {
      this._conciliaUhSvc.subscription.push(
        this._tipoEntidadesSvc.loadAllTipoEntidades().subscribe(res => {
          const result = res.getAllTipoEntidades;

          if (!result.success) {
            this._swalSvc.error(result.error);
            return;
          }

          this.tipoEntidadValues = result.data.map(
            (t: { Id: any; Entidades: any }) => {
              return {
                value: t.Id,
                label: t.Entidades,
              };
            }
          );
        })
      );
    } catch (err: any) {
      this._swalSvc.error(err);
    }
  }

  private _updateTipoEntidad(idUnidad: number): void {
    this._conciliaUhSvc.subscription.push(
      this._clasifEntidadesSvc.loadClasificadorEntidad(idUnidad).subscribe({
        next: res => {
          const result = res.getClasificadorEntidad;

          this.fg.controls['tipoEntidad'].setValue(result.IdTipoEntidad);
        },
        error: err => {
          this._swalSvc.error(err);
        },
      })
    );
  }

  conciliar(): void {
    try {
      this.loading = true;

      this._conciliaUhSvc.subscription.push(
        this._conciliaUhSvc.conciliar().subscribe({
          next: res => {
            this.loading = false;

            this.dataSourceConciliacion = cloneDeep(res.conciliaUH || []);
            this.dataSourceInventario = this.dataSourceConciliacion
              ? cloneDeep(
                  this.dataSourceConciliacion.filter(
                    r => r.Tipo === 'Inventario'
                  )
                )
              : [];
            this.dataSourceDesgaste = this.dataSourceConciliacion
              ? cloneDeep(
                  this.dataSourceConciliacion.filter(r => r.Tipo === 'Desgaste')
                )
              : [];
          },
          error: err => {
            this.loading = false;

            this._swalSvc.error(err);
          },
        })
      );
    } catch (err: any) {
      this.loading = false;

      this._swalSvc.error(err);
    }
  }

  async reporte(): Promise<void> {
    try {
      const documentDefinitions = {
        info: {
          title: 'Conciliación Rodas vs UH | SISCO',
        },
        pageSize: 'LETTER',
        pageOrientation: 'landscape',
        content: [
          await this._pdfMakeSvc.getHeaderDefinition(
            'Conciliación Rodas vs Útiles y Herramientas'
          ),
          await this._pdfMakeSvc.getPeriodoDefinition(
            +moment(this.fg.controls['periodo'].value).format('MM'),
            moment(this.fg.controls['periodo'].value).format('YYYY')
          ),
          await this._conciliaUhSvc.getConciliacionDefinition(
            this.dataSourceConciliacion,
            this.fg.controls['tipoCentro'].value
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

  handleTabViewChange(event: any): void {
    try {
      this.selectedTabViewIndex = event.index;
    } catch (err: any) {
      this._swalSvc.error(err);
    }
  }
}

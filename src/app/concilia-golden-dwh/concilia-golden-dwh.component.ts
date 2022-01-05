import { SelectItem } from 'primeng/api';
import { SupervisoresService } from './../supervisores/shared/services/supervisores.service';
import { EmpleadosService } from './../empleados/shared/services/empleados.service';
import { UnidadesService } from './../unidades/shared/services/unidades.service';
import { MatTabGroup } from '@angular/material/tabs';
import { DivisionesService } from './../shared/services/divisiones.service';
import { PdfmakeService } from './../shared/services/pdfmake.service';
import { toNumber } from 'lodash';
import { ConciliaDWHQueryResponse } from './shared/models/concilia-dwh.model';
import { ConciliaGoldenDwhService } from './shared/services/concilia-golden-dwh.service';
import { FormGroup } from '@angular/forms';
import { Apollo } from 'apollo-angular';
import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, AfterContentChecked } from '@angular/core';
import SweetAlert from 'sweetalert2';
import * as moment from 'moment';
import { MatTableDataSource } from '@angular/material/table';

const conciliaDWHQuery = require('graphql-tag/loader!./shared/graphql/concilia-dwh.query.gql');

const DISPLAYED_COLUMNS_CENTRO = ['Almacen', 'Cuenta',
                                'SaldoGolden', 'SaldoRestaurador', 'DifGoldenRest',
                                'SaldoDistribuidor', 'DifGoldenDist',
                                'SaldoRodas', 'DifGoldenRodas'];
const DISPLAYED_COLUMNS_CONSOLIDADO = ['Unidad',
                                'SaldoGolden', 'SaldoRestaurador', 'DifGoldenRest',
                                'SaldoDistribuidor', 'DifGoldenDist',
                                'SaldoRodas', 'DifGoldenRodas'];

@Component({
  selector: 'app-concilia-golden-dwh',
  templateUrl: './concilia-golden-dwh.component.html',
  styleUrls: ['./concilia-golden-dwh.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConciliaGoldenDwhComponent implements OnInit, AfterViewInit, AfterContentChecked, OnDestroy {
  @ViewChild('tabGroup') tabGroup: MatTabGroup;

  divisionesValues: SelectItem[] = [];
  centrosValues: SelectItem[] = [];
  empleadosValues: SelectItem[] = [];
  supervisoresValues: SelectItem[] = [];

  displayedColumnsConciliacion = DISPLAYED_COLUMNS_CENTRO;
  displayedColumnsAlmacenes = ['IdUnidad', 'Almacen', 'CuentaG', 'CuentaR'];
  rodasDWHInventarioVentas: any[] = [];
  dataSourceInventario = new MatTableDataSource();
  dataSourceVenta = new MatTableDataSource();
  dataSourceAlmacenes = [];

  isConsolidado = false;
  loading = false;

  unidadesList: any[] = [];

  tipoCentrosValues: SelectItem[] = [
    { value: '0', label: 'Centro'},
    { value: '1', label: 'Consolidado'},
  ];

  subscription: Subscription[] = [];

  fg: FormGroup;

  myDatepicker: any;

  constructor(
    private _apollo: Apollo,
    private _divisionesSvc: DivisionesService,
    private _unidadesSvc: UnidadesService,
    private _empleadosSvc: EmpleadosService,
    private _supervisoresSvc: SupervisoresService,
    private _conciliaDWHSvc: ConciliaGoldenDwhService,
    private _pdfMakeSvc: PdfmakeService,
    private _changeDedectionRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.fg = this._conciliaDWHSvc.fg;
    this._inicializarFg();
    this._subscribeToFgValueChanges();
  }

  ngAfterViewInit(): void {
    this._getDivisiones();
    this._getEmpleados();
    this._getSupervisores();
  }

  ngAfterContentChecked(): void {
    this._changeDedectionRef.detectChanges();
  }

  ngOnDestroy(): void {
    this.subscription.forEach(subsc => subsc.unsubscribe());
  }

  private _inicializarFg(): void {
    const today = new Date();
    const fgValues = {
      tipoCentro: '0',
      idDivision: null,
      idCentro: null,
      periodo: new Date(today.getFullYear(), today.getMonth(), 0),
      idEmpleado: null,
      idSupervisor: null,
      isComplejo: false,
      ventasAcumuladas: true,
    };

    this.fg.patchValue(fgValues);
  }

  private _subscribeToFgValueChanges(): void {
    // TipoCentro
    this.subscription.push(this.fg.controls['tipoCentro'].valueChanges.subscribe(value => {
      this.displayedColumnsConciliacion = value === '0' ? DISPLAYED_COLUMNS_CENTRO : DISPLAYED_COLUMNS_CONSOLIDADO;
      this.isConsolidado = value === '1';

      this._inicializarDatos();
    }));

    // IdDivision
    this.subscription.push(this.fg.controls['idDivision'].valueChanges.subscribe(value => {
      this.fg.controls['idCentro'].setValue(null);

      this._getUnidades(value);
    }));

    // IdCentro
    this.subscription.push(this.fg.controls['idCentro'].valueChanges.subscribe(value => {
      this.fg.controls['isComplejo'].setValue(false);

      const subordinados = this.unidadesList.filter(f => f.IdSubdivision === value && f.Abierta === true);

      this.fg.controls['isComplejo'].setValue(subordinados.length > 1);

      this._inicializarDatos();
    }));

    this.subscription.push(this.fg.controls['periodo'].valueChanges.subscribe(value => {
      this._inicializarDatos();
    }));

    this.subscription.push(this.fg.controls['ventasAcumuladas'].valueChanges.subscribe(value => {
      this._inicializarDatos();
    }));
  }

  private _inicializarDatos(): void {
    this.rodasDWHInventarioVentas = [];
    this.dataSourceInventario = new MatTableDataSource();
    this.dataSourceVenta = new MatTableDataSource();
    this.dataSourceAlmacenes = [];
  }

  private _getDivisiones(): void {
    try {
      this.subscription.push(this._divisionesSvc.getDivisiones().subscribe(response => {
        const result = response.getAllDivisiones;

        if (!result.success) {
          return SweetAlert.fire({
            icon: 'error',
            title: 'ERROR',
            text: result.error,
            showConfirmButton: true,
            confirmButtonText: 'Aceptar'
          });
        }

        this.divisionesValues = result.data.map((d: { IdDivision: string; Division: string; }) => {
          return {
            value: d.IdDivision,
            label: d.IdDivision + '-' + d.Division
          };
        });
      }));
    } catch (err: any) {
      SweetAlert.fire({
        icon: 'error',
        title: 'ERROR',
        text: err,
        showConfirmButton: true,
        confirmButtonText: 'Aceptar'
      });
    }
  }

  private _getUnidades(idDivision: number): void {
    try {
      if (!idDivision) {
        this.unidadesList = [];
        this.centrosValues = [];

        return;
      }

      this.subscription.push(this._unidadesSvc.getUnidadesByIdDivision(idDivision).subscribe(response => {
        const result = response.getUnidadesByIdDivision;

        if (!result.success) {
          return SweetAlert.fire({
            icon: 'error',
            title: 'ERROR',
            text: result.error,
            showConfirmButton: true,
            confirmButtonText: 'Aceptar'
          });
        }

        this.unidadesList = result.data;
        this.centrosValues = this.unidadesList.map(d => {
          return {
            value: d.IdUnidad,
            label: d.IdUnidad + '-' + d.Nombre
          };
        });
      }));
    } catch (err: any) {
      SweetAlert.fire({
        icon: 'error',
        title: 'ERROR',
        text: err,
        showConfirmButton: true,
        confirmButtonText: 'Aceptar'
      });
    }
  }

  private _getEmpleados(): void {
    try {
      this.subscription.push(this._empleadosSvc.loadAllEmpleados().subscribe(response => {
        const result = response.getAllEmpleados;

        if (!result.success) {
          return SweetAlert.fire({
            icon: 'error',
            title: 'ERROR',
            text: result.error,
            showConfirmButton: true,
            confirmButtonText: 'Aceptar'
          });
        }

        this.empleadosValues = result.data.map(d => {
          return {
            value: d.IdEmpleado,
            label: d.Empleado
          };
        });
      }));
    } catch (err: any) {
      SweetAlert.fire({
        icon: 'error',
        title: 'ERROR',
        text: err,
        showConfirmButton: true,
        confirmButtonText: 'Aceptar'
      });
    }
  }

  private _getSupervisores(): void {
    try {
      this.subscription.push(this._supervisoresSvc.loadAllSupervisores().subscribe(response => {
        const result = response.getAllSupervisores;

        if (!result.success) {
          return SweetAlert.fire({
            icon: 'error',
            title: 'ERROR',
            text: result.error,
            showConfirmButton: true,
            confirmButtonText: 'Aceptar'
          });
        }

        this.supervisoresValues = result.data.map(d => {
          return {
            value: d.IdSupervisor,
            label: d.Supervisor
          };
        });
      }));
    } catch (err: any) {
      SweetAlert.fire({
        icon: 'error',
        title: 'ERROR',
        text: err,
        showConfirmButton: true,
        confirmButtonText: 'Aceptar'
      });
    }
  }

  conciliar(): void {
    try {
      const conciliaDWHInput = {
        idDivision: toNumber(this.fg.controls['idDivision'].value),
        idCentro: toNumber(this.fg.controls['idCentro'].value),
        periodo: toNumber(moment(this.fg.controls['periodo'].value).format('MM')),
        annio: toNumber(moment(this.fg.controls['periodo'].value).format('YYYY')),
        tipoCentro: toNumber(this.fg.controls['tipoCentro'].value),
        ventasAcumuladas: this.fg.controls['ventasAcumuladas'].value,
      };

      if (conciliaDWHInput.tipoCentro === 2) {
        SweetAlert.fire({
          icon: 'question',
          title: `Para obtener la información Consolidada, se debe haber terminado la Contabilidad del Consolidado del período
              ${ conciliaDWHInput.periodo.toString() }/${ conciliaDWHInput.annio.toString() } .`,
          text: '¿Desea continuar con la Conciliación del Consolidado?',
          showConfirmButton: true,
          confirmButtonText: 'Sí',
          showCancelButton: true,
          cancelButtonText: 'No'
        }).then(res => {
          if (res.dismiss) {
            return;
          }
        });
      }

      this.loading = true;

      this.subscription.push(this._apollo.query<ConciliaDWHQueryResponse>({
        query: conciliaDWHQuery,
        variables: { conciliaDWHInput },
        fetchPolicy: 'network-only'
      }).subscribe(response => {
        this.loading = false;

        const result = response.data.conciliaDWH;

        if (!result.success) {
          return SweetAlert.fire({
            icon: 'error',
            title: 'ERROR',
            text: result.error,
            showConfirmButton: true,
            confirmButtonText: 'Aceptar'
          });
        }
        this.rodasDWHInventarioVentas = JSON.parse(result.data.RodasDWHInventarioVentas.data);

        const dataInventario = this.rodasDWHInventarioVentas ? this.rodasDWHInventarioVentas.filter(f => f.Tipo === 'Inventario') : [];
        this._conciliaDWHSvc.getFormattedConciliaDWH(dataInventario, conciliaDWHInput.tipoCentro.toString()).then(res => {
          this.dataSourceInventario = new MatTableDataSource(res);
        });

        const dataVenta = this.rodasDWHInventarioVentas ? this.rodasDWHInventarioVentas.filter(f => f.Tipo === 'Ventas') : [];
        this._conciliaDWHSvc.getFormattedConciliaDWH(dataVenta, conciliaDWHInput.tipoCentro.toString()).then(res => {
          this.dataSourceVenta = new MatTableDataSource(res);
        });

        this.dataSourceAlmacenes = JSON.parse(result.data.RodasDWHAlmacenes.data);
      }));
    } catch (err: any) {
      this.loading = false;

      SweetAlert.fire({
        icon: 'error',
        title: 'Error',
        text: err,
        showConfirmButton: true,
        confirmButtonText: 'Aceptar'
      });
    }
  }

  isGroup(index: any, item: any): boolean {
    return item.isGroupBy;
  }

  getTotalInvSaldoGolden(): number {
    return this.rodasDWHInventarioVentas && this.rodasDWHInventarioVentas.length ?
          this.rodasDWHInventarioVentas.filter(f => f.Tipo === 'Inventario' && f.Almacen !== 'TOTAL')
                                  .map(t => t.SaldoGolden || 0).reduce((acc, value) => acc + value, 0) : 0;
  }

  getTotalInvSaldoRestaurador(): number {
    return this.rodasDWHInventarioVentas && this.rodasDWHInventarioVentas.length ?
          this.rodasDWHInventarioVentas.filter(f => f.Tipo === 'Inventario' && f.Almacen !== 'TOTAL')
                                  .map(t => t.SaldoRestaurador || 0).reduce((acc, value) => acc + value, 0) : 0;
  }

  getTotalInvDifGoldenRest(): number {
    return this.rodasDWHInventarioVentas && this.rodasDWHInventarioVentas.length ?
          this.rodasDWHInventarioVentas.filter(f => f.Tipo === 'Inventario' && f.Almacen !== 'TOTAL')
                                  .map(t => t.DifGoldenRest || 0).reduce((acc, value) => acc + value, 0) : 0;
  }

  getTotalInvSaldoDistribuidor(): number {
    return this.rodasDWHInventarioVentas && this.rodasDWHInventarioVentas.length ?
          this.rodasDWHInventarioVentas.filter(f => f.Tipo === 'Inventario' && f.Almacen !== 'TOTAL')
                                  .map(t => t.SaldoDistribuidor || 0).reduce((acc, value) => acc + value, 0) : 0;
  }

  getTotalInvDifGoldenDist(): number {
    return this.rodasDWHInventarioVentas && this.rodasDWHInventarioVentas.length ?
          this.rodasDWHInventarioVentas.filter(f => f.Tipo === 'Inventario' && f.Almacen !== 'TOTAL')
                                  .map(t => t.DifGoldenDist || 0).reduce((acc, value) => acc + value, 0) : 0;
  }

  getTotalInvSaldoRodas(): number {
    return this.rodasDWHInventarioVentas && this.rodasDWHInventarioVentas.length ?
          this.rodasDWHInventarioVentas.filter(f => f.Tipo === 'Inventario' && f.Almacen !== 'TOTAL')
                                  .map(t => t.SaldoRodas || 0).reduce((acc, value) => acc + value, 0) : 0;
  }

  getTotalInvDifGoldenRodas(): number {
    return this.rodasDWHInventarioVentas && this.rodasDWHInventarioVentas.length ?
          this.rodasDWHInventarioVentas.filter(f => f.Tipo === 'Inventario' && f.Almacen !== 'TOTAL')
                                  .map(t => t.DifGoldenRodas || 0).reduce((acc, value) => acc + value, 0) : 0;
  }

  getTotalVtaSaldoGolden(): number {
    return this.rodasDWHInventarioVentas && this.rodasDWHInventarioVentas.length ?
          this.rodasDWHInventarioVentas.filter(f => f.Tipo === 'Venta' && f.Almacen !== 'TOTAL')
                              .map(t => t.SaldoGolden || 0).reduce((acc, value) => acc + value, 0) : 0;
  }

  getTotalVtaSaldoRestaurador(): number {
    return this.rodasDWHInventarioVentas && this.rodasDWHInventarioVentas.length ?
          this.rodasDWHInventarioVentas.filter(f => f.Tipo === 'Venta' && f.Almacen !== 'TOTAL')
                              .map(t => t.SaldoRestaurador || 0).reduce((acc, value) => acc + value, 0) : 0;
  }

  getTotalVtaDifGoldenRest(): number {
    return this.rodasDWHInventarioVentas && this.rodasDWHInventarioVentas.length ?
          this.rodasDWHInventarioVentas.filter(f => f.Tipo === 'Venta' && f.Almacen !== 'TOTAL')
                              .map(t => t.DifGoldenRest || 0).reduce((acc, value) => acc + value, 0) : 0;
  }

  getTotalVtaSaldoDistribuidor(): number {
    return this.rodasDWHInventarioVentas && this.rodasDWHInventarioVentas.length ?
          this.rodasDWHInventarioVentas.filter(f => f.Tipo === 'Venta' && f.Almacen !== 'TOTAL')
                              .map(t => t.SaldoDistribuidor || 0).reduce((acc, value) => acc + value, 0) : 0;
  }

  getTotalVtaDifGoldenDist(): number {
    return this.rodasDWHInventarioVentas && this.rodasDWHInventarioVentas.length ?
          this.rodasDWHInventarioVentas.filter(f => f.Tipo === 'Venta' && f.Almacen !== 'TOTAL')
                              .map(t => t.DifGoldenDist || 0).reduce((acc, value) => acc + value, 0) : 0;
  }

  getTotalVtaSaldoRodas(): number {
    return this.rodasDWHInventarioVentas && this.rodasDWHInventarioVentas.length ?
          this.rodasDWHInventarioVentas.filter(f => f.Tipo === 'Venta' && f.Almacen !== 'TOTAL')
                              .map(t => t.SaldoRodas || 0).reduce((acc, value) => acc + value, 0) : 0;
  }

  getTotalVtaDifGoldenRodas(): number {
    return this.rodasDWHInventarioVentas && this.rodasDWHInventarioVentas.length ?
          this.rodasDWHInventarioVentas.filter(f => f.Tipo === 'Venta' && f.Almacen !== 'TOTAL')
                              .map(t => t.DifGoldenRodas || 0).reduce((acc, value) => acc + value, 0) : 0;
  }

  reporte(): void {
    switch (this.tabGroup.selectedIndex) {
      case 2:
        this.reporteAlmacenes();
        break;
      default:
        this.reporteConcilia();
        break;
    }
  }

  async reporteConcilia(): Promise<any> {
    try {
      const documentDefinitions = {
        pageSize: 'LETTER',
        pageOrientation: 'landscape',
        content: [
          await this._pdfMakeSvc.getHeaderDefinition('Conciliación Rodas vs Golden DWH'),
          await this._pdfMakeSvc.getPeriodoDefinition(this.fg.controls['periodo'].value),
          await this._conciliaDWHSvc.getConciliacionDefinition(this.rodasDWHInventarioVentas, this.fg.controls['tipoCentro'].value, this.fg.controls['ventasAcumuladas'].value),
        ],
        footer: (page: string, pages: string) => {
          return this._pdfMakeSvc.getFooterDefinition(page, pages);
        },
        defaultStyle: {
          fontSize: 9,
        },
        styles: {
          tableHeader: {
            bold: true
          }
        }
      };

      this._pdfMakeSvc.generatePdf(documentDefinitions);
    } catch (err: any) {
      SweetAlert.fire({
        icon: 'error',
        title: 'Error',
        text: err,
        showConfirmButton: true,
        confirmButtonText: 'Aceptar'
      });
    }
  }

  async reporteAlmacenes(): Promise<any> {
    try {
      const documentDefinitions = {
        pageSize: 'LETTER',
        // pageOrientation: 'landscape',
        content: [
          await this._pdfMakeSvc.getHeaderDefinition('Conciliación de Almacenes del Rodas Vs Golden DWH'),
          await this._pdfMakeSvc.getPeriodoDefinition(this.fg.controls['periodo'].value),
          await this._conciliaDWHSvc.getAlmacenesDefinition(this.dataSourceAlmacenes),
        ],
        footer: (page: string, pages: string) => {
          return this._pdfMakeSvc.getFooterDefinition(page, pages);
        },
        defaultStyle: {
          fontSize: 9,
        },
        styles: {
          tableHeader: {
            bold: true
          }
        }
      };

      this._pdfMakeSvc.generatePdf(documentDefinitions);
    } catch (err: any) {
      SweetAlert.fire({
        icon: 'error',
        title: 'Error',
        text: err,
        showConfirmButton: true,
        confirmButtonText: 'Aceptar'
      });
    }
  }


}

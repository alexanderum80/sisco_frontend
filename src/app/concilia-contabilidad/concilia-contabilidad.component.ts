import { ClasificadorEntidadesService } from './../clasificador-entidades/shared/services/clasificador-entidades.service';
import { TipoEntidadesService } from './../tipo-entidades/shared/services/tipo-entidades.service';
import { PdfmakeService } from './../shared/services/pdfmake.service';
import { ConciliaContabilidadService } from './shared/services/concilia-contabilidad.service';
import { UnidadesService } from './../unidades/shared/services/unidades.service';
import { FormGroup } from '@angular/forms';
import { Component, OnInit, ViewChild, ChangeDetectorRef, OnDestroy, AfterViewInit } from '@angular/core';
import { MenuItem, SelectItem } from 'primeng/api';
import { ITableColumns } from '../shared/ui/prime-ng/table/table.model';
import { cloneDeep } from '@apollo/client/utilities';
import { TabView } from 'primeng/tabview';
import Swal from 'sweetalert2';

const DISPLAYED_COLUMNS_CONSULTAS: ITableColumns[] = [
  { header: 'Cuenta', field: 'Cuenta', type: 'string' },
  { header: 'SubCuenta', field: 'SubCuenta', type: 'string' },
  { header: 'Análisis 1', field: 'Analisis1', type: 'string' },
  { header: 'Análisis 2', field: 'Analisis2', type: 'string' },
  { header: 'Análisis 3', field: 'Analisis3', type: 'string' },
  { header: 'Total', field: 'Total', type: 'decimal' },
];

@Component({
  selector: 'app-concilia-contabilidad',
  templateUrl: './concilia-contabilidad.component.html',
  styleUrls: ['./concilia-contabilidad.component.scss']
})
export class ConciliaContabilidadComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(TabView) tabView: TabView;

  centrosValues: SelectItem[] = [];
  tipoEntidadValues: SelectItem[] = [];

  displayedColumnsConciliacion = DISPLAYED_COLUMNS_CONSULTAS;
  displayedColumnsExpresiones: ITableColumns[] = [
    { header: 'Expresión', field: 'Expresion', type: 'string' },
    { header: 'Valor', field: 'Valor', type: 'decimal' },
    { header: 'Operador', field: 'Operador', type: 'string' },
    { header: 'Expresión', field: 'ExpresionC', type: 'string' },
    { header: 'Valor', field: 'ValorC', type: 'decimal' },
    { header: 'Resultado', field: 'Resultado', type: 'string' },
  ];
  displayedColumnsValores: ITableColumns[] = [
    { header: 'Código', field: 'Codigo', type: 'string' },
    { header: 'Expresión', field: 'Expresion', type: 'string' },
    { header: 'Valor', field: 'Valor', type: 'decimal' },
    { header: 'Operador', field: 'Operador', type: 'string' },
    { header: 'Valor Rodas', field: 'ValorRodas', type: 'decimal' },
    { header: 'Estado', field: 'Estado', type: 'string' },
  ];
  displayedColumnsClasificador: ITableColumns[] = [
    { header: 'Cuenta', field: 'Cuenta', type: 'string' },
    { header: 'SubCuenta', field: 'SubCuenta', type: 'string' },
    { header: 'Descripción', field: 'Descripcion', type: 'string' },
    { header: 'Crit1 Clasif', field: 'Crt1Clasif', type: 'string' },
    { header: 'Crit1 Rodas', field: 'Crt1Rodas', type: 'string' },
    { header: 'Crit2 Clasif', field: 'Crt2Clasif', type: 'string' },
    { header: 'Crit2 Rodas', field: 'Crt2Rodas', type: 'string' },
    { header: 'Crit3 Clasif', field: 'Crt3Clasif', type: 'string' },
    { header: 'Crit3 Rodas', field: 'Crt3Rodas', type: 'string' },
    { header: 'Nat Clasif', field: 'NatClasif', type: 'string' },
    { header: 'Nat Rodas', field: 'NatRodas', type: 'string' },
    { header: 'Obl Clasif', field: 'OblClasif', type: 'boolean' },
    { header: 'Obl Rodas', field: 'OblRodas', type: 'boolean' },
    { header: 'Term Clasf', field: 'TermClasf', type: 'boolean' },
    { header: 'Term Rodas', field: 'TermRodas', type: 'boolean' },
    { header: 'Crit1 Cons Clasif', field: 'Crit1ConsClasif', type: 'string' },
    { header: 'Crit1 Cons Rodas', field: 'Crit1ConsRodas', type: 'string' },
    { header: 'Crit2 Cons Clasif', field: 'Crit2ConsClasif', type: 'string' },
    { header: 'Crit2 Cons Rodas', field: 'Crit2ConsRodas', type: 'string' },
    { header: 'Crit3 Cons Clasif', field: 'Crit3ConsClasif', type: 'string' },
    { header: 'Crit3 Cons Rodas', field: 'Crit3ConsRodas', type: 'string' },
  ];
  dataSourceAsientos = [];
  dataSourceExpresiones = [];
  dataSourceValores = [];
  dataSourceClasificador = [];

  isConsolidado = false;
  loading = false;

  selectedTabViewIndex = 0;

  tipoCentrosValues: SelectItem[] = [
    { value: '0', label: 'Centro'},
    { value: '1', label: 'Complejo'},
    { value: '2', label: 'Consolidado'},
  ];

  fg: FormGroup;

  myDatepicker: any;

  buttonConciliarItems: MenuItem[] = [
    { label: 'Inicializar Datos', icon: 'mdi mdi-restart', command: () => {
      this.iniciarSaldos();
    }},
    // { separator: true },
    // { label: 'Conciliar Apertura', icon: 'mdi mdi-calendar-multiple-check', command: () => {
    // }},
    // { label: 'Conciliar Cierre', icon: 'mdi mdi-calendar-check', command: () => {
    // }}
  ];

  constructor(
    private _unidadesSvc: UnidadesService,
    private _tipoEntidadesSvc: TipoEntidadesService,
    private _clasifEntidadesSvc: ClasificadorEntidadesService,
    private _conciliaContabSvc: ConciliaContabilidadService,
    private _pdfMakeSvc: PdfmakeService,
    private _changeDedectionRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.fg = this._conciliaContabSvc.fg;
    this._conciliaContabSvc.inicializarFg();
    this._subscribeToFgValueChanges();

    this._changeDedectionRef.detectChanges();
  }
  
  ngAfterViewInit(): void {
    this._getUnidades();
    this._getTipoEntidades();
  }

  ngOnDestroy(): void {
    this._conciliaContabSvc.dispose();
  }

  private _subscribeToFgValueChanges(): void {
    this._conciliaContabSvc.subscription.push(this.fg.valueChanges.subscribe(value => {
      this._inicializarDatos();
    }));

    // TipoCentro
    this._conciliaContabSvc.subscription.push(this.fg.controls['tipoCentro'].valueChanges.subscribe(value => {
      this.isConsolidado = value === '2';
      if (value === '2') {
        this.fg.controls['tipoEntidad'].setValue(1);
      } else {
        const idUnidad = this.fg.get('idCentro')?.value;
        if (idUnidad) {
          this._updateTipoEntidad(idUnidad);
        } else {
          this.fg.controls['tipoEntidad'].setValue('');
        }
      }
    }));

    // IdCentro
    this._conciliaContabSvc.subscription.push(this.fg.controls['idCentro'].valueChanges.subscribe(value => {
      if (this.fg.get('tipoCentro')?.value === '2') {
        this.fg.controls['tipoEntidad'].setValue(1);
      } else if (value) {
        this._updateTipoEntidad(value);
      } else {
        this.fg.controls['tipoEntidad'].setValue('');
      }
    }));
  }

  private _inicializarDatos(): void {
    this.dataSourceAsientos = [];
    this.dataSourceExpresiones = [];
    this.dataSourceValores = [];
    this.dataSourceClasificador = [];
  }

  private _getUnidades(): void {
    try {
      this._conciliaContabSvc.subscription.push(this._unidadesSvc.getAllUnidades().subscribe(response => {
        const result = response.getAllUnidades;

        if (!result.success) {
          return Swal.fire({
            icon: 'error',
            title: 'ERROR',
            text: result.error,
            showConfirmButton: true,
            confirmButtonText: 'Aceptar'
          });
        }

        this.centrosValues = result.data.map((u: { IdUnidad: string; Nombre: string; }) => {
          return {
            value: u.IdUnidad,
            label: u.IdUnidad + '-' + u.Nombre
          };
        });
      }));
    } catch (err: any) {
      Swal.fire({
        icon: 'error',
        title: 'ERROR',
        text: err,
        showConfirmButton: true,
        confirmButtonText: 'Aceptar'
      });
    }
  }

  private _getTipoEntidades(): void {
    try {
      this._conciliaContabSvc.subscription.push(this._tipoEntidadesSvc.loadAllTipoEntidades().subscribe(response => {
        const result = response.getAllTipoEntidades;

        if (!result.success) {
          return Swal.fire({
            icon: 'error',
            title: 'ERROR',
            text: result.error,
            showConfirmButton: true,
            confirmButtonText: 'Aceptar'
          });
        }

        this.tipoEntidadValues = result.data.map((t: { Id: any; Entidades: any; }) => {
          return {
            value: t.Id,
            label: t.Entidades
          };
        });
      }));
    } catch (err: any) {
      Swal.fire({
        icon: 'error',
        title: 'ERROR',
        text: err,
        showConfirmButton: true,
        confirmButtonText: 'Aceptar'
      });
    }
  }

  private _updateTipoEntidad(idUnidad: number): void {
    this._conciliaContabSvc.subscription.push(this._clasifEntidadesSvc.loadClasificadorEntidad(idUnidad).subscribe(response => {
      const result = response.getClasificadorEntidad;

      if (!result.success) {
        return Swal.fire({
          icon: 'error',
          title: 'ERROR',
          text: result.error,
          showConfirmButton: true,
          confirmButtonText: 'Aceptar'
        });
      }

      this.fg.controls['tipoEntidad'].setValue(result.data.IdTipoEntidad);
    }));
  }

  conciliar(): void {
    try {

      this.loading = true;

      this._conciliaContabSvc.subscription.push(this._conciliaContabSvc.conciliar().subscribe(response => {
        this.loading = false;

        const result = response.conciliaContabilidad;

        this.dataSourceClasificador = JSON.parse(result.data.ReporteClasificador.data) || [];

        if (!result.success) {
          return Swal.fire({
            icon: 'error',
            title: 'ERROR',
            text: result.error,
            showConfirmButton: true,
            confirmButtonText: 'Aceptar'
          });
        }

        this.dataSourceAsientos = cloneDeep(JSON.parse(result.data.ReporteConsultas.data)) || [];
        this.dataSourceExpresiones = cloneDeep(JSON.parse(result.data.ReporteExpresiones.data)) || [];
        this.dataSourceValores = cloneDeep(JSON.parse(result.data.ReporteValores.data)) || [];
      }));
    } catch (err: any) {
      this.loading = false;

      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err,
        showConfirmButton: true,
        confirmButtonText: 'Aceptar'
      });
    }
  }

  iniciarSaldos(): void {
    try {
      this._conciliaContabSvc.subscription.push(this._conciliaContabSvc.iniciarSaldo().subscribe(response => {
        const result = response.iniciarSaldos;

        if (result?.success) {
          return Swal.fire({
            icon: 'info',
            title: 'Información',
            text: 'Datos Iniciados Correctamente.',
            showConfirmButton: true,
            confirmButtonText: 'Aceptar'
          });
        } else {
          return Swal.fire({
            icon: 'error',
            title: 'ERROR',
            text: result?.error,
            showConfirmButton: true,
            confirmButtonText: 'Aceptar'
          });
        }
      }));
    } catch (err: any) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err,
        showConfirmButton: true,
        confirmButtonText: 'Aceptar'
      });
    }
  }

  reporte(): void {
    switch (this.selectedTabViewIndex) {
      case 3:
        this.reporteDiferenciaClasificador();
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
        // pageOrientation: 'landscape',
        content: [
          await this._pdfMakeSvc.getHeaderDefinition('Certificación para la entrega de los Estados Financieros'),
          await this._pdfMakeSvc.getPeriodoDefinition(this.fg.controls['periodo'].value),
          await this._conciliaContabSvc.getCentro(this.fg.get('idCentro')?.value, this.centrosValues),
          await this._conciliaContabSvc.getTipoEntidad(this.fg.get('tipoEntidad')?.value, this.tipoEntidadValues),
          await this._conciliaContabSvc.getReporteAsientoDefinition(this.dataSourceAsientos),
          await this._conciliaContabSvc.getReporteExpresionesDefinition(this.dataSourceExpresiones),
          await this._conciliaContabSvc.getReporteValoresDefinition(this.dataSourceValores),
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
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err,
        showConfirmButton: true,
        confirmButtonText: 'Aceptar'
      });
    }
  }

  async reporteDiferenciaClasificador(): Promise<any> {
    try {
      const documentDefinitions = {
        pageSize: 'LETTER',
        pageOrientation: 'landscape',
        content: [
          await this._pdfMakeSvc.getHeaderDefinition('Diferencias entre el Clasificador y el Clasificador del Rodas'),
          await this._pdfMakeSvc.getPeriodoDefinition(this.fg.controls['periodo'].value),
          await this._conciliaContabSvc.getCentro(this.fg.get('idCentro')?.value, this.centrosValues),
          await this._conciliaContabSvc.getReporteDiferenciaClasificadorDefinition(this.dataSourceClasificador),
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
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err as string,
        showConfirmButton: true,
        confirmButtonText: 'Aceptar'
      });
    }
  }

  handleTabViewChange(event: any): void {
    try {
      this.selectedTabViewIndex = event.index;
    } catch (err: any) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err,
        showConfirmButton: true,
        confirmButtonText: 'Aceptar'
      });
    }
  }

}

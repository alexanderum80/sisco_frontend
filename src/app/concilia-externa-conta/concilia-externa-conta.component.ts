import { BehaviorSubject } from 'rxjs';
import { ISupervisoresInfo } from './../supervisores/shared/models/supervisores.model';
import { SupervisoresService } from './../supervisores/shared/services/supervisores.service';
import { IEmpleadoInfo } from './../empleados/shared/models/empleados.model';
import { EmpleadosService } from './../empleados/shared/services/empleados.service';
import { AuthenticationService } from './../shared/services/authentication.service';
import { ITableColumns } from 'src/app/shared/ui/prime-ng/table/table.model';
import { PdfmakeService } from './../shared/helpers/pdfmake.service';
import { orderBy } from 'lodash';
import { ActionClicked } from './../shared/models/list-items';
import { UnidadesService } from './../unidades/shared/services/unidades.service';
import { DivisionesService } from './../shared/services/divisiones.service';
import { SweetalertService } from './../shared/helpers/sweetalert.service';
import { ExcelService } from '../shared/helpers/excel.service';
import { ConciliaExternaContaService } from './shared/service/concilia-externa.service';
import {
  ConciliaMenuOptions,
  ConciliaStatus,
} from './shared/models/concilia-externa.model';
import { SocketService } from './../shared/services/socket.service';
import { SelectItem, MenuItem } from 'primeng/api';
import {
  Component,
  OnInit,
  AfterViewInit,
  ChangeDetectorRef,
  AfterContentChecked,
} from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-concilia-externa-conta',
  templateUrl: './concilia-externa-conta.component.html',
  styleUrls: ['./concilia-externa-conta.component.scss'],
})
export class ConciliaExternaContaComponent
  implements OnInit, AfterViewInit, AfterContentChecked
{
  private _conciliacionStatusSubject = new BehaviorSubject<string>('');

  divisionesValues: SelectItem[] = [
    {
      value: '0',
      label: '--TODAS--',
    },
  ];
  divisionesODValues: SelectItem[] = [
    {
      value: '0',
      label: '--TODAS--',
    },
  ];

  unidadesValues: SelectItem[] = [
    {
      value: '0',
      label: '--TODAS--',
    },
  ];
  unidadesODValues: SelectItem[] = [
    {
      value: '0',
      label: '--TODAS--',
    },
  ];

  empleadosValues: SelectItem[] = [];
  empleadosODValues: SelectItem[] = [];
  empleadosSupervisorValues: SelectItem[] = [];

  conciliaContabData: any[] = [];
  actaConciliaEmisorData: any[] = [];
  actaConciliaReceptorData: any[] = [];

  displayedColumns: ITableColumns[] = [
    { header: 'Tipo', field: 'Tipo', type: 'string' },
    { header: 'Documento', field: 'Documento', type: 'string' },
    { header: 'Cuenta Emisor', field: 'CuentaEmisor', type: 'string' },
    { header: 'Emisor', field: 'Emisor', type: 'string' },
    { header: 'Fecha Emisión', field: 'FechaEmision', type: 'string' },
    {
      header: 'Importe Emisor',
      field: 'ValorEmisor',
      type: 'decimal',
      totalize: true,
    },
    { header: 'Cuenta Receptor', field: 'CuentaReceptor', type: 'string' },
    { header: 'División Receptor', field: 'DivisionReceptor', type: 'string' },
    { header: 'Receptor', field: 'Receptor', type: 'string' },
    { header: 'Fecha Recepción', field: 'FechaRecepcion', type: 'string' },
    {
      header: 'Importe Receptor',
      field: 'ValorReceptor',
      type: 'decimal',
      totalize: true,
    },
    {
      header: 'Diferencia',
      field: 'DiferenciaImporte',
      type: 'decimal',
      totalize: true,
    },
  ];

  actaDisplayedColumns: ITableColumns[] = [
    { header: 'Detalle', field: 'Detalle', type: 'string', width: '250px' },
    {
      header: 'Saldo Emisor',
      field: 'SaldoEmisor',
      type: 'decimal',
      totalize: true,
    },
    {
      header: 'Saldo Receptor',
      field: 'SaldoReceptor',
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

  conciliarButtonItems: MenuItem[] = [
    {
      id: ConciliaMenuOptions.IniciarConciliacion,
      label: 'Iniciar Conciliación',
      icon: 'mdi mdi-folder-lock-open',
      disabled: false,
      visible: true,
      command: () => {
        this._iniciarConciliacion();
      },
    },
    {
      id: ConciliaMenuOptions.CerrarConciliacion,
      label: 'Cerrar Conciliación',
      icon: 'mdi mdi-folder-lock',
      disabled: false,
      visible: true,
      command: () => {
        this._swalSvc
          .question(
            `Si cierra la Conciliación, ningún otro centro podrá Conciliar.
            <br>¿Desea Cerrar la conciliación del período actual?`
          )
          .then(res => {
            if (res === ActionClicked.Yes) {
              this._cerrarConciliacion();
            }
          });
      },
    },
    {
      id: ConciliaMenuOptions.ReabrirConciliacion,
      label: 'Reabrir Conciliación',
      icon: 'mdi mdi-folder-key-outline',
      disabled: false,
      visible: true,
      command: () => {
        this._swalSvc
          .question(
            `¿Está seguro que desea reabrir la conciliación del período actual?`
          )
          .then(res => {
            if (res === ActionClicked.Yes) {
              this._reabrirConciliacion();
            }
          });
      },
    },
  ];

  reportesButtonItems: MenuItem[] = [
    {
      id: ConciliaMenuOptions.DeudasResumen,
      label: 'Deudas Resumen',
      icon: 'mdi mdi-file-sign',
      disabled: false,
      visible: true,
      command: () => {
        this._calculaConciliacionResumen();
      },
    },
    {
      id: ConciliaMenuOptions.DeudasResumen,
      label: 'Deudas Por Edades',
      icon: 'mdi mdi-file-clock',
      disabled: false,
      visible: true,
      command: () => {
        this._calculaConciliacionDeudasPorEdades();
      },
    },
    // {
    //   id: ConciliaMenuOptions.DiferenciasConciliacion,
    //   label: 'Diferencias en Conciliación',
    //   icon: 'mdi mdi-file-document-edit-outline',
    //   disabled: false,
    //   visible: true,
    //   command: () => {
    //     this._diferenciasEnConciliacion();
    //   },
    // },
    // {
    //   id: ConciliaMenuOptions.CentroNoConciliados,
    //   label: 'Centros no Conciliados',
    //   icon: 'mdi mdi-file-document-remove-outline',
    //   disabled: false,
    //   visible: true,
    //   command: () => {
    //     this._centrosNoConciliados();
    //   },
    // },
  ];

  selectedTab = 0;
  reporteName = 'Conciliación Externa en Rodas.';

  loadingDivisiones = false;
  loadingUnidades = false;
  loadingUsuarios = false;
  loadingConcNacVsAsiento = false;
  loadingConciliacion = false;
  loadingConciliacionEntreUnidadesEmisor = false;
  loadingConciliacionEntreUnidadesReceptor = false;
  loadingDiferenciasConciliacion = false;
  loadingCentrosNoConciliados = false;

  saving = false;

  fg: FormGroup;

  showReport = false;

  chatToggle = true;

  constructor(
    private _authSvc: AuthenticationService,
    public _conciliaExternaContaSvc: ConciliaExternaContaService,
    private _socketService: SocketService,
    private _excelService: ExcelService,
    private _swalSvc: SweetalertService,
    private _divisionesSvc: DivisionesService,
    private _unidadesSvc: UnidadesService,
    private _empleadosSvc: EmpleadosService,
    private _supervisoresSvc: SupervisoresService,
    private _pdfMakeSvc: PdfmakeService,
    private _cd: ChangeDetectorRef
  ) {
    this._conciliacionStatusSubject.subscribe(status => {
      switch (status) {
        case ConciliaStatus.NoIniciada:
          this._updateConciliaButtonOptions(
            ConciliaMenuOptions.IniciarConciliacion
          );
          break;
        case ConciliaStatus.Abierta:
          this._updateConciliaButtonOptions(
            ConciliaMenuOptions.CerrarConciliacion
          );
          break;
        case ConciliaStatus.Cerrada:
          this._updateConciliaButtonOptions(
            ConciliaMenuOptions.ReabrirConciliacion
          );
          break;
      }
    });
  }

  ngOnInit() {
    this.fg = this._conciliaExternaContaSvc.fg;
    this.fg.reset();

    if (
      (this._authSvc.hasSuperAdminPermission() ||
        this._authSvc.hasAdminPermission() ||
        this._authSvc.hasFinancistaPermission()) &&
      this._authSvc.usuario.IdDivision === 100
    ) {
      this.fg.get('division')?.enable();
    } else {
      this.fg.get('division')?.disable();
    }

    this._subscribeToFgChange();

    this._loadDivisiones();
    this._loadSupervisores();
    // this._loadUsuarios();
  }

  ngAfterViewInit() {
    this._loadDatosConciliacion();
    this._subscribeToConciliacionStatusChange();
  }

  ngAfterContentChecked(): void {
    this._cd.detectChanges();
  }

  private _subscribeToConciliacionStatusChange() {
    this._socketService.conciliaStatus$.subscribe(() => {
      this._loadDatosConciliacion();
    });
  }

  get conciliacionStatus(): string {
    return this._conciliacionStatusSubject.value;
  }

  get conciliacionStatusAbierta() {
    return this._conciliacionStatusSubject.value === ConciliaStatus.Abierta;
  }

  hasAdminPermission() {
    return this._authSvc.hasAdminPermission();
  }

  hasUsuarioAvanzadoPermission() {
    return this._authSvc.hasAdvancedUserPermission();
  }

  hasFinancistaPermission() {
    return this._authSvc.hasFinancistaPermission();
  }

  private _loadDatosConciliacion() {
    this._conciliaExternaContaSvc.getDatosConciliacion().subscribe({
      next: res => {
        if (res.getDatosConciliacionExterna) {
          this._conciliacionStatusSubject.next(
            res.getDatosConciliacionExterna.Abierta
              ? ConciliaStatus.Abierta
              : ConciliaStatus.Cerrada
          );
        } else {
          this._conciliacionStatusSubject.next(ConciliaStatus.NoIniciada);
          this._updateConciliaButtonOptions(
            ConciliaMenuOptions.IniciarConciliacion
          );
        }
      },
      error: err => {
        this._swalSvc.error(err.message || err);
      },
    });
  }

  private _updateConciliaButtonOptions(menuOption: string) {
    this.conciliarButtonItems.map(menu => {
      menu.visible =
        menu.id === menuOption && this._authSvc.hasFinancistaPermission();
    });
  }

  private _loadDivisiones() {
    this.divisionesValues = [
      {
        value: '0',
        label: '--TODAS--',
      },
    ];

    this.divisionesODValues = [
      {
        value: '0',
        label: '--TODAS--',
      },
    ];

    this._divisionesSvc.getDivisiones().subscribe({
      next: responseD => {
        this.loadingDivisiones = false;
        const result = responseD.getAllDivisiones;

        result.map((d: any) => {
          this.divisionesValues.push({
            value: d,
            label: d.IdDivision.toString() + '-' + d.Division,
          });
        });

        result.map((d: any) => {
          this.divisionesODValues.push({
            value: d,
            label: d.IdDivision.toString() + '-' + d.Division,
          });
        });

        // get division del usuario loggeado y se lo asigno a la división a analizar
        const _userDivision = result.find(
          (d: { IdDivision: number; Division: string }) =>
            d.IdDivision === this._authSvc.usuario.IdDivision
        );

        this.fg.controls['division'].setValue(_userDivision || '0');
      },
      error: err => {
        this._swalSvc.error(err.message || err);
      },
    });
  }

  private _loadUnidades(origenDestino: boolean) {
    if (origenDestino)
      this.unidadesODValues = [
        {
          value: '0',
          label: '--TODAS--',
        },
      ];
    else
      this.unidadesValues = [
        {
          value: '0',
          label: '--TODAS--',
        },
      ];

    const idDivision = origenDestino
      ? +this.fg.controls['divisionOD'].value.IdDivision || null
      : +this.fg.controls['division'].value.IdDivision || null;

    if (!idDivision) {
      return;
    }

    this._unidadesSvc.getUnidadesByIdDivision(idDivision).subscribe({
      next: responseD => {
        this.loadingUnidades = false;
        const data = responseD.getUnidadesByIdDivision;

        if (origenDestino) {
          data.map((u: any) => {
            this.unidadesODValues.push({
              value: u,
              label: u.Nombre,
            });
          });
        } else {
          data.map((u: any) => {
            this.unidadesValues.push({
              value: u,
              label: u.Nombre,
            });
          });
        }
      },
      error: err => {
        this._swalSvc.error(err.message || err);
      },
    });
  }

  private _loadEmpleados(origenDestino: boolean) {
    const idDivision = origenDestino
      ? +this.fg.controls['divisionOD'].value.IdDivision || null
      : +this.fg.controls['division'].value.IdDivision || null;

    if (!idDivision) {
      return;
    }

    if (origenDestino) this.empleadosODValues = [];
    else this.empleadosValues = [];

    this._empleadosSvc.loadEmpleadoByIdDivision(idDivision).subscribe({
      next: res => {
        this.loadingUnidades = false;
        const result = res.getEmpleadosByIdDivision;

        if (!result.success) {
          return this._swalSvc.error(result.error);
        }

        if (origenDestino) {
          this.empleadosODValues = result.data.map((u: IEmpleadoInfo) => {
            return {
              value: u,
              label: u.Empleado,
            };
          });
        } else {
          this.empleadosValues = result.data.map((u: IEmpleadoInfo) => {
            return {
              value: u,
              label: u.Empleado,
            };
          });
        }
      },
      error: err => {
        this._swalSvc.error(err.message || err);
      },
    });
  }

  private _loadSupervisores() {
    this._supervisoresSvc.loadSupervisorByIdDivision(100).subscribe({
      next: res => {
        this.loadingUnidades = false;
        const result = res.getSupervisoresByIdDivision;

        if (!result.success) {
          return this._swalSvc.error(result.error);
        }

        this.empleadosSupervisorValues = result.data.map(
          (u: ISupervisoresInfo) => {
            return {
              value: u,
              label: u.Supervisor,
            };
          }
        );
      },
      error: err => {
        this._swalSvc.error(err.message || err);
      },
    });
  }

  private _subscribeToFgChange() {
    this.fg.controls['division'].valueChanges.subscribe(() => {
      this.fg.controls['unidad'].setValue('0');
      this._inicializarDatos();

      this._loadUnidades(false);
      this._loadEmpleados(false);
    });
    this.fg.controls['divisionOD'].valueChanges.subscribe(() => {
      this.fg.controls['unidadOD'].setValue('0');
      this._inicializarDatos();

      this._loadUnidades(true);
      this._loadEmpleados(true);
    });

    this.fg.controls['periodo'].valueChanges.subscribe(() => {
      this._inicializarDatos();

      this._loadDatosConciliacion();
    });

    this.fg.controls['periodoActual'].valueChanges.subscribe(() => {
      this._inicializarDatos();
    });

    this.fg.controls['unidad'].valueChanges.subscribe(() => {
      this._inicializarDatos();
    });

    this.fg.controls['unidadOD'].valueChanges.subscribe(() => {
      this._inicializarDatos();
    });

    this.fg.controls['usuarioEmisor'].valueChanges.subscribe(value => {
      this.fg.controls['cargoEmisor'].reset();
      if (value) {
        this.fg.controls['cargoEmisor'].setValue(value.Cargo.Cargo);
      }
    });

    this.fg.controls['usuarioReceptor'].valueChanges.subscribe(value => {
      this.fg.controls['cargoReceptor'].reset();
      if (value) {
        this.fg.controls['cargoReceptor'].setValue(value.Cargo.Cargo);
      }
    });

    this.fg.controls['usuarioSupervisor'].valueChanges.subscribe(value => {
      this.fg.controls['cargoSupervisor'].reset();
      if (value) {
        this.fg.controls['cargoSupervisor'].setValue(value.Cargo.Cargo);
      }
    });
  }

  private _inicializarDatos() {
    this.conciliaContabData = [];
    this._conciliaExternaContaSvc.ConciliaContabRowData = [];
    this.actaConciliaEmisorData = [];
    this._conciliaExternaContaSvc.ActaConciliacionEmisorRowData = [];
    this.actaConciliaReceptorData = [];
    this._conciliaExternaContaSvc.ActaConciliacionReceptorRowData = [];
  }

  private _iniciarConciliacion() {
    this._conciliaExternaContaSvc.iniciarConciliacion().subscribe({
      next: () => {
        this._socketService.emitSocket('concilia-status-change', true);

        this._swalSvc.info('Se ha iniciado la Conciliación correctamente.');
      },
      error: err => {
        this._swalSvc.error(err.message || err);
      },
    });
  }

  private _cerrarConciliacion() {
    this._conciliaExternaContaSvc.cerrarConciliacion().subscribe({
      next: () => {
        this._socketService.emitSocket('concilia-status-change', false);

        this._swalSvc.info('Se ha cerrado la Conciliación correctamente.');
      },
      error: err => {
        this._swalSvc.error(err.message || err);
      },
    });
  }

  private _reabrirConciliacion() {
    this._conciliaExternaContaSvc.reabrirConciliacion().subscribe({
      next: () => {
        this._socketService.emitSocket('concilia-status-change', true);

        this._swalSvc.info('Se ha reabierto la Conciliación correctamente.');
      },
      error: err => {
        this._swalSvc.error(err.message || err);
      },
    });
  }

  get isFormValid() {
    return this.fg ? this.fg.valid : false;
  }

  get loading() {
    return (
      this.loadingConcNacVsAsiento ||
      this.loadingDivisiones ||
      this.loadingUsuarios ||
      this.loadingUnidades ||
      this.loadingConciliacion ||
      this.loadingConciliacionEntreUnidadesEmisor ||
      this.loadingConciliacionEntreUnidadesReceptor ||
      this.loadingDiferenciasConciliacion ||
      this.loadingCentrosNoConciliados
    );
  }

  conciliar() {
    try {
      if (this.conciliacionStatus !== ConciliaStatus.Abierta) {
        this._swalSvc.error(
          'No se puede Conciliar porque la Conciliación no está Abierta.'
        );
        return;
      }

      this.loadingConciliacion = true;

      this._conciliaExternaContaSvc.calculaConciliacion().subscribe({
        next: res => {
          this.loadingConciliacion = false;

          this.conciliaContabData = [
            ...res.getConciliacionExternaContab.getConciliaContab,
          ];
          this._conciliaExternaContaSvc.ConciliaContabRowData = [
            ...this.conciliaContabData,
          ];

          const datosActa = [
            ...res.getConciliacionExternaContab.getActaConciliacion,
          ];
          const actaEmisor = datosActa.filter(
            (f: any) =>
              f.Emisor.toString() ===
                this.fg.controls['unidad'].value.IdUnidad.toString() &&
              f.Receptor.toString() ===
                this.fg.controls['unidadOD'].value.IdUnidad.toString()
          );
          const actaReceptor = datosActa.filter(
            (f: any) =>
              f.Receptor.toString() ===
                this.fg.controls['unidad'].value.IdUnidad.toString() &&
              f.Emisor.toString() ===
                this.fg.controls['unidadOD'].value.IdUnidad.toString()
          );

          this.actaConciliaEmisorData = [...actaEmisor];
          this._conciliaExternaContaSvc.ActaConciliacionEmisorRowData = [
            ...actaEmisor,
          ];

          this.actaConciliaReceptorData = [...actaReceptor];
          this._conciliaExternaContaSvc.ActaConciliacionReceptorRowData = [
            ...actaReceptor,
          ];
        },
        error: err => {
          this.loadingConciliacion = false;
          this._swalSvc.error(err.message || err);
        },
      });
    } catch (err: any) {
      this.loadingConciliacion = false;
      this._swalSvc.error(err.message || err);
    }
  }

  /* #region Reportes */
  async reporte() {
    switch (this.selectedTab) {
      case 0: // reporte conciliación
        this.reporteName = 'Conciliación Nacional en Rodas.';
        this.generatePDF(0);
        break;
      case 1: // acta emisor
        this._conciliacionEntreUnidadesEmisor();
        break;
      case 2: // acta receptor
        this._conciliacionEntreUnidadesReceptor();
        break;
    }
  }

  private _calculaConciliacionResumen() {
    try {
      this.loadingConciliacion = true;

      this._conciliaExternaContaSvc.calculaConciliacionResumen().subscribe({
        next: res => {
          this.loadingConciliacion = false;

          this._conciliaExternaContaSvc.ConciliaContabResumenRowData =
            res.getConciliacionExternaContabResumen;

          this.reporteName = 'Deudas Resumen en la Conciliación Nacional';

          this.generatePDF(10);
        },
        error: err => {
          this.loadingConciliacion = false;
          this._swalSvc.error(err.message || err);
        },
      });
    } catch (err: any) {
      this.loadingConciliacion = false;
      this._swalSvc.error(err.message || err);
    }
  }

  private _calculaConciliacionDeudasPorEdades() {
    try {
      this.loadingConciliacion = true;

      this._conciliaExternaContaSvc
        .calculaConciliacionDeudasPorEdades()
        .subscribe({
          next: res => {
            this.loadingConciliacion = false;

            this._conciliaExternaContaSvc.ConciliaContabDeudasPorEdadesRowData =
              res.getConciliacionExternaContabDeudasPorEdades;

            this.reporteName =
              'Deudas Resumen por Edades en la Conciliación Nacional';

            this.generatePDF(11);
          },
          error: err => {
            this.loadingConciliacion = false;
            this._swalSvc.error(err.message || err);
          },
        });
    } catch (err: any) {
      this.loadingConciliacion = false;
      this._swalSvc.error(err.message || err);
    }
  }

  private _conciliacionEntreUnidadesEmisor() {
    try {
      if (
        this.fg.get('unidad')?.value === '0' ||
        this.fg.get('unidadOD')?.value === '0'
      )
        return this._swalSvc.warning(
          'Para poder emitir el Acta debe seleccionar las Unidades.'
        );

      this.loadingConciliacionEntreUnidadesEmisor = true;

      this._conciliaExternaContaSvc
        .conciliacionEntreUnidadesEmisor()
        .subscribe({
          next: res => {
            this.loadingConciliacionEntreUnidadesEmisor = false;

            this._conciliaExternaContaSvc.ConciliacionEntreUnidadesEmisorRowData =
              res.getConciliacionEntreUnidades;

            this.reporteName =
              'Acta de Conciliación Cuentas por Cobrar y Pagar';

            this.generatePDF(1);
          },
          error: err => {
            this.loadingConciliacionEntreUnidadesEmisor = false;
            this._swalSvc.error(err.message || err);
          },
        });
    } catch (err: any) {
      this.loadingConciliacionEntreUnidadesEmisor = false;
      this._swalSvc.error(err.message || err);
    }
  }

  private _conciliacionEntreUnidadesReceptor() {
    try {
      if (
        this.fg.get('unidad')?.value === '0' ||
        this.fg.get('unidadOD')?.value === '0'
      )
        return this._swalSvc.warning(
          'Para poder emitir el Acta debe seleccionar las Unidades.'
        );

      this.loadingConciliacionEntreUnidadesReceptor = true;

      this._conciliaExternaContaSvc
        .conciliacionEntreUnidadesReceptor()
        .subscribe({
          next: res => {
            this.loadingConciliacionEntreUnidadesReceptor = false;

            this._conciliaExternaContaSvc.ConciliacionEntreUnidadesReceptorRowData =
              res.getConciliacionEntreUnidades;

            this.reporteName =
              'Acta de Conciliación Cuentas por Cobrar y Pagar';

            this.generatePDF(2);
          },
          error: err => {
            this.loadingConciliacionEntreUnidadesReceptor = false;
            this._swalSvc.error(err.message || err);
          },
        });
    } catch (err: any) {
      this.loadingConciliacionEntreUnidadesReceptor = false;
      this._swalSvc.error(err.message || err);
    }
  }

  private _diferenciasEnConciliacion() {
    this.loadingDiferenciasConciliacion = true;

    this._conciliaExternaContaSvc.diferenciasConciliacion().subscribe({
      next: res => {
        this.loadingDiferenciasConciliacion = false;

        const result = res.getDiferenciasEnConciliacion;
        if (!result.success) {
          return this._swalSvc.error(result.error);
        }

        this._conciliaExternaContaSvc.DiferenciasConciliacionRowData =
          result.data;
        this.reporteName = 'Documentos con Diferencias en la Conciliación';

        this.generatePDF(15);
      },
      error: err => {
        this.loadingDiferenciasConciliacion = false;
        this._swalSvc.error(err.message || err);
      },
    });
  }

  private _centrosNoConciliados() {
    try {
      this.loadingCentrosNoConciliados = true;

      this._conciliaExternaContaSvc.diferenciasConciliacion().subscribe({
        next: res => {
          this.loadingCentrosNoConciliados = false;

          const result = res.getDiferenciasEnConciliacion;
          if (!result.success) {
            return this._swalSvc.error(result.error);
          }

          let data = result.data;
          data = orderBy(data, ['Emisor', 'Receptor']);

          this._conciliaExternaContaSvc.CentrosNoConciliadosRowData = data;
          this.reporteName = 'Centros que no realizaron la Conciliación';

          this.generatePDF(16);
        },
        error: err => {
          this._swalSvc.error(err.message || err);
        },
      });
    } catch (err: any) {
      this._swalSvc.error(err.message || err);
    }
  }

  async generatePDF(_selectedTab: number) {
    const documentDefinition =
      await this._conciliaExternaContaSvc.getPdfDefinition(
        this.reporteName,
        _selectedTab
      );
    this._pdfMakeSvc.generatePdf(documentDefinition);
  }

  closeReporte() {
    this.showReport = false;
  }
  /* #endregion */

  exportar() {
    let data = [];
    switch (this.selectedTab) {
      case 0:
        data = this._conciliaExternaContaSvc.ConciliaContabRowData;
        break;
      case 1:
        data = this._conciliaExternaContaSvc.ActaConciliacionEmisorRowData.data;
        break;
      case 2:
        data =
          this._conciliaExternaContaSvc.ActaConciliacionReceptorRowData.data;
        break;
    }

    this._excelService.exportAsExcelFile(data, this.reporteName);
  }

  onDropdownChange(event: any): void {
    this.fg.controls[event.control].setValue(event.value);
  }

  switchChatToggle(value: boolean) {
    this.chatToggle = value;
  }
}

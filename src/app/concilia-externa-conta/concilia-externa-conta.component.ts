import { ISupervisoresInfo } from './../supervisores/shared/models/supervisores.model';
import { SupervisoresService } from './../supervisores/shared/services/supervisores.service';
import { IEmpleadoInfo } from './../empleados/shared/models/empleados.model';
import { EmpleadosService } from './../empleados/shared/services/empleados.service';
import { AuthenticationService } from './../shared/services/authentication.service';
import { ITableColumns } from 'src/app/shared/ui/prime-ng/table/table.model';
import { PdfmakeService } from './../shared/services/pdfmake.service';
import { orderBy } from 'lodash';
import { ActionClicked } from './../shared/models/list-items';
import { UnidadesService } from './../unidades/shared/services/unidades.service';
import { DivisionesService } from './../shared/services/divisiones.service';
import { SweetalertService } from './../shared/services/sweetalert.service';
import { ExcelService } from './shared/service/excel.service';
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
  private _conciliacionStatus = '';
  divisionesValues: SelectItem[] = [];
  divisionesODValues: SelectItem[] = [];

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
      field: 'SaldoEmisor',
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
      id: ConciliaMenuOptions.DiferenciasConciliacion,
      label: 'Diferencias en Conciliación',
      icon: 'mdi mdi-file-document-edit-outline',
      disabled: false,
      visible: true,
      command: () => {
        this._diferenciasEnConciliacion();
      },
    },
    {
      id: ConciliaMenuOptions.CentroNoConciliados,
      label: 'Centros no Conciliados',
      icon: 'mdi mdi-file-document-box-remove-outline',
      disabled: false,
      visible: true,
      command: () => {
        this._centrosNoConciliados();
      },
    },
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

  isEditing = false;

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
  ) {}

  ngOnInit() {
    this.fg = this._conciliaExternaContaSvc.fg;
    this.fg.reset();

    if (!this._authSvc.hasAdvancedUserPermission()) {
      this.fg.get('division')?.disable();
    }

    this._subscribeToFgChange();

    this.fg.controls['division'].setValue(
      this._authSvc.usuario.IdDivision.toString()
    );

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

  set conciliacionStatus(status) {
    this._conciliacionStatus = status;
  }

  get conciliacionStatus() {
    return this._conciliacionStatus;
  }

  get conciliacionStatusAbierta() {
    return this._conciliacionStatus === ConciliaStatus.Abierta;
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
        if (res.getDatosConciliacionExterna)
          this._updateConciliaStatus(res.getDatosConciliacionExterna.Abierta);
        else {
          this.conciliacionStatus = ConciliaStatus.NoIniciada;
          this._updateMenuOptions(ConciliaMenuOptions.IniciarConciliacion);
        }
      },
      error: err => {
        this._swalSvc.error(err.message || err);
      },
    });
  }

  private _updateConciliaStatus(abierta: boolean) {
    switch (abierta) {
      case true:
        this.conciliacionStatus = ConciliaStatus.Abierta;
        this._updateMenuOptions(ConciliaMenuOptions.CerrarConciliacion);
        break;
      case false:
        this.conciliacionStatus = ConciliaStatus.Cerrada;
        this._updateMenuOptions(ConciliaMenuOptions.ReabrirConciliacion);
        break;
    }
  }

  private _updateMenuOptions(menuOption: string) {
    this.conciliarButtonItems.map(menu => {
      menu.visible =
        menu.id === menuOption && this._authSvc.hasFinancistaPermission();
    });

    this.reportesButtonItems.map(menu => {
      if (
        menu.id === ConciliaMenuOptions.DiferenciasConciliacion ||
        menu.id === ConciliaMenuOptions.CentroNoConciliados
      ) {
        menu.visible =
          menuOption === ConciliaMenuOptions.ReabrirConciliacion &&
          this._authSvc.usuario.TipoUsuario === 1;
      }
    });
  }

  private _loadDivisiones() {
    this._divisionesSvc.getDivisiones().subscribe({
      next: responseD => {
        this.loadingDivisiones = false;
        const result = responseD.getAllDivisiones;

        if (!result.success) {
          return this._swalSvc.error(result.error);
        }

        this.divisionesValues = result.data.map((d: any) => {
          return {
            value: d.IdDivision.toString(),
            label: d.IdDivision.toString() + '-' + d.Division,
          };
        });
        this.divisionesValues.unshift({
          value: '0',
          label: '--TODAS--',
        });

        this.divisionesODValues = result.data.map((d: any) => {
          return {
            value: d.IdDivision.toString(),
            label: d.IdDivision.toString() + '-' + d.Division,
          };
        });
        this.divisionesODValues.unshift({
          value: '0',
          label: '--TODAS--',
        });
      },
      error: err => {
        this._swalSvc.error(err.message || err);
      },
    });
  }

  private _loadUnidades(origenDestino: boolean) {
    const idDivision = origenDestino
      ? +this.fg.controls['divisionOD'].value
      : +this.fg.controls['division'].value;

    if (!idDivision) {
      return;
    }

    if (origenDestino) this.unidadesODValues = [];
    else this.unidadesValues = [];

    this._unidadesSvc.getUnidadesByIdDivision(idDivision).subscribe({
      next: responseD => {
        this.loadingUnidades = false;
        const result = responseD.getUnidadesByIdDivision;

        if (!result.success) {
          return this._swalSvc.error(result.error);
        }

        if (origenDestino) {
          this.unidadesODValues = result.data.map((u: any) => {
            return {
              value: u,
              label: u.Nombre,
            };
          });
          this.unidadesODValues.unshift({
            value: '0',
            label: '--TODAS--',
          });
        } else {
          this.unidadesValues = result.data.map((u: any) => {
            return {
              value: u,
              label: u.Nombre,
            };
          });
          this.unidadesValues.unshift({
            value: '0',
            label: '--TODAS--',
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
      ? +this.fg.controls['divisionOD'].value
      : +this.fg.controls['division'].value;

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

  private _diferenciasEnConciliacion() {
    this.loadingDiferenciasConciliacion = true;

    this._conciliaExternaContaSvc.diferenciasConciliacion().subscribe({
      next: response => {
        this.loadingDiferenciasConciliacion = false;

        const result = response.getDiferenciasEnConciliacion;
        if (!result.success) {
          return this._swalSvc.error(result.error);
        }

        this._conciliaExternaContaSvc.DiferenciasConciliacionRowData =
          result.data;
        this.reporteName = 'Documentos con Diferencias en la Conciliación';
        this.selectedTab = 10;

        this.generatePDF();
      },
      error: err => {
        this._swalSvc.error(err.message || err);
      },
    });
  }

  private _centrosNoConciliados() {
    try {
      this.loadingCentrosNoConciliados = true;

      this._conciliaExternaContaSvc.diferenciasConciliacion().subscribe({
        next: response => {
          this.loadingCentrosNoConciliados = false;

          const result = response.getDiferenciasEnConciliacion;
          if (!result.success) {
            return this._swalSvc.error(result.error);
          }

          let data = result.data;
          data = orderBy(data, ['Emisor', 'Receptor']);

          this._conciliaExternaContaSvc.CentrosNoConciliadosRowData = data;
          this.reporteName = 'Centros que no realizaron la Conciliación';
          this.selectedTab = 11;

          this.generatePDF();
        },
        error: err => {
          this._swalSvc.error(err.message || err);
        },
      });
    } catch (err: any) {
      this._swalSvc.error(err.message || err);
    }
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
        next: response => {
          this.loadingConciliacion = false;

          this.conciliaContabData = [
            ...response.getConciliacionExternaContab.getConciliaContab,
          ];
          this._conciliaExternaContaSvc.ConciliaContabRowData = [
            ...this.conciliaContabData,
          ];

          const datosActa = [
            ...response.getConciliacionExternaContab.getActaConciliacion,
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
      case 0:
        this.reporteName = 'Conciliación Nacional en Rodas.';
        this.generatePDF();
        break;
      case 1:
        this._conciliacionEntreUnidadesEmisor();
        break;
      case 2:
        this._conciliacionEntreUnidadesReceptor();
        break;
    }
  }

  private _conciliacionEntreUnidadesEmisor() {
    try {
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

            this.generatePDF();
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

            this.generatePDF();
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

  async generatePDF() {
    const documentDefinition =
      await this._conciliaExternaContaSvc.getPdfDefinition(
        this.reporteName,
        this.selectedTab
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

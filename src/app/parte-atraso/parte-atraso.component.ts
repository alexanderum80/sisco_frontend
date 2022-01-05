import { SelectItem } from 'primeng/api';
import { DivisionesService } from './../shared/services/divisiones.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ParteAtrasoService } from './shared/services/parte-atraso.service';
import { Subscription } from 'rxjs';
import { Apollo } from 'apollo-angular';
import { ParteAtrasosQueryResponse } from './shared/models/parte-atraso.model';
import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { PdfmakeService } from './../shared/services/pdfmake.service';
import { toNumber } from 'lodash';
import SweetAlert from 'sweetalert2';
import { MatTabGroup } from '@angular/material/tabs';

const parteAtrasosQuery = require('graphql-tag/loader!./shared/graphql/parte-atrasos.query.gql');

@Component({
  selector: 'app-parte-atraso',
  templateUrl: './parte-atraso.component.html',
  styleUrls: ['./parte-atraso.component.scss']
})
export class ParteAtrasoComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('tabGroup') tabGroup: MatTabGroup;

  selectedTabViewIndex = 0;

  dataSourceParteAtraso = [];
  dataSourceDatosIdGam = [];
  displayedColumnsParteAtraso = ['Unidad', 'AtrasoRest', 'AtrasoDWH', 'AtrasoDist', 'AtrasoEmp'];
  displayedColumnsDatosIdGam = ['Ano', 'Mes', 'Fecha', 'Version', 'vUtilnet', 'UltimaCircular', 'PeriodoRestaurado'];

  divisionesValues: SelectItem[] = [];
  loading = false;

  fg: FormGroup = new FormGroup({
    idDivision: new FormControl(null)
  });

  subscription: Subscription[] = [];

  constructor(
    private _apollo: Apollo,
    private _divisionesSvc: DivisionesService,
    private _parteAtrasoSvc: ParteAtrasoService,
    private _pdfMakeSvc: PdfmakeService,
  ) { }

  ngOnInit(): void {
    this._subscribeToFgChanges();
  }
  
  ngAfterViewInit(): void {
    this._getDivisiones();
  }

  ngOnDestroy(): void {
    this.subscription.map(s => s.unsubscribe());
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

  private _subscribeToFgChanges(): void {
    this.subscription.push(this.fg.valueChanges.subscribe(() => {
      this.dataSourceParteAtraso = [];
      this.dataSourceDatosIdGam = [];
    }));
  }

  get formValid(): boolean {
    return this.fg.valid;
  }

  isGroup(index: any, item: { isGroupBy: boolean; }): boolean {
    return item.isGroupBy;
  }

  calcular(): void {
    try {
      this.loading = true;

      const idDivision = toNumber(this.fg.controls['idDivision'].value);

      this.subscription.push(this._apollo.query<ParteAtrasosQueryResponse>({
        query: parteAtrasosQuery,
        variables: { idDivision },
        fetchPolicy: 'network-only'
      }).subscribe(response => {
        this.loading = false;
        const { parteAtrasos: _parteAtrasos, datosIdGAM: _datosIdGAM } = response.data;

        if (!_parteAtrasos.success || !_datosIdGAM.success) {
          return SweetAlert.fire({
            icon: 'error',
            title: 'Error',
            text: _parteAtrasos.error || _datosIdGAM.error,
            showConfirmButton: true,
            confirmButtonText: 'Aceptar'
          });
        }

        this.dataSourceParteAtraso = JSON.parse(_parteAtrasos.data);
        this._parteAtrasoSvc.getFormattedDetalleParteAtraso(JSON.parse(_datosIdGAM.data)).then(data => {
          this.dataSourceDatosIdGam = data;
        });
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

  handleTabViewChange(event: any): void {
    try {
      this.selectedTabViewIndex = event.index;
    } catch (err: any) {
      SweetAlert.fire({
        icon: 'error',
        title: 'Error',
        text: err as string,
        showConfirmButton: true,
        confirmButtonText: 'Aceptar'
      });
    }
  }

  reporte(): void {
    switch (this.tabGroup.selectedIndex) {
      case 0:
        this._reporteParteAtraso();
        break;
      case 1:
        this._reporteDetalleParteAtraso();
        break;
    }
  }

  private async _reporteParteAtraso(): Promise<any> {
    try {
      const documentDefinitions = {
        pageSize: 'LETTER',
        // pageOrientation: 'landscape',
        content: [
          await this._pdfMakeSvc.getHeaderDefinition('Parte de Atrasos DWH'),
          await this._getDivisionDefinition(),
          await this._parteAtrasoSvc.getParteAtrasosDefinition(this.dataSourceParteAtraso),
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

  private async _reporteDetalleParteAtraso(): Promise<any> {
    try {
      const documentDefinitions = {
        pageSize: 'LETTER',
        // pageOrientation: 'landscape',
        content: [
          await this._pdfMakeSvc.getHeaderDefinition('Detalle de las Salvas Golden DWH'),
          await this._getDivisionDefinition(),
          await this._parteAtrasoSvc.getDetalleParteAtrasoDefinition(this.dataSourceDatosIdGam),
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

  private _getDivisionDefinition(): any {
    const definition = [];

    const divisionValue = this.divisionesValues.find(d => d.value === this.fg.controls['idDivision'].value)?.label;

    definition.push({
      text: 'División: ' + divisionValue,
      bold: true,
      margin: [0, 10, 0, 0]
    });

    return definition;
  }


}

import { UnidadesService } from './../unidades/shared/services/unidades.service';
import { SubdivisionesService } from './../shared/services/subdivisiones.service';
import { DivisionesService } from './../shared/services/divisiones.service';
import { PdfmakeService } from './../shared/services/pdfmake.service';
import { ConciliaInternaDWHQueryResponse } from './shared/models/concilia-interna-dwh.model';
import SweetAlert from 'sweetalert2';
import { Apollo } from 'apollo-angular';
import { Subscription } from 'rxjs';
import { ConcilaInternaDwhService } from './shared/services/concila-interna-dwh.service';
import { FormGroup } from '@angular/forms';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { cloneDeep } from 'lodash';

const conciliaInternaDWHQuery = require('graphql-tag/loader!./shared/graphql/concilia-interna-dwh.query.gql');

@Component({
  selector: 'app-concilia-interna-dwh',
  templateUrl: './concilia-interna-dwh.component.html',
  styleUrls: ['./concilia-interna-dwh.component.scss']
})
export class ConciliaInternaDwhComponent implements OnInit, AfterViewInit {
  fg: FormGroup;

  divisionesValues: SelectItem[] = [];
  subdivisionesValues: SelectItem[] = [];
  unidadesValues: SelectItem[] = [];
  unidadesODValues: SelectItem[] = [];

  displayedColumns = ['Documento', 'Emisor', 'FechaE', 'ImporteE', 'Receptor', 'FechaR', 'ImporteR', 'Diferencia'];

  dataSource: any[] = [];

  totalEmisor = 0;
  totalReceptor = 0;
  totalDiferencia = 0;

  subscription: Subscription[] = [];

  loading = false;

  constructor(
    private _apollo: Apollo,
    private _divisionesSvc: DivisionesService,
    private _subdivisionesSvc: SubdivisionesService,
    private _unidadesSvc: UnidadesService,
    private _conciliarInternaDWHSvc: ConcilaInternaDwhService,
    private _pdfMakeSvc: PdfmakeService,
  ) { }

  ngOnInit(): void {
    this._conciliarInternaDWHSvc.inicializarFormGroup();
    this.fg = this._conciliarInternaDWHSvc.fg;

    this._subscribeToFgValueChanges();
  }
  
  ngAfterViewInit(): void {
    this._getDivisiones();
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

  private _getSubdivisiones(): void {
    try {
      const idDivision = this.fg.controls['idDivision'].value;

      if (!idDivision) {
        return;
      }

      this.subscription.push(this._subdivisionesSvc.getSubdivisionesByIdDivision(idDivision).subscribe(response => {
        const result = response.getSubdivisionesByIdDivision;

        if (!result.success) {
          return SweetAlert.fire({
            icon: 'error',
            title: 'ERROR',
            text: result.error,
            showConfirmButton: true,
            confirmButtonText: 'Aceptar'
          });
        }

        this.subdivisionesValues = result.data.map((d: any) => {
          return {
            value: d.IdSubdivision,
            label: d.IdSubdivision + '-' + d.Subdivision
          }
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

  private _getUnidades(origenDestino: boolean): void {
    try {
      const idSubdivision = origenDestino ? this.fg.controls['idSubdivisionOD'].value : this.fg.controls['idSubdivision'].value;
      if (!idSubdivision) {
        return;
      }

      this.subscription.push(this._unidadesSvc.getUnidadesByIdSubdivision(idSubdivision).subscribe(response => {
        const result = response.getUnidadesByIdSubdivision;

        if (!result.success) {
          return SweetAlert.fire({
            icon: 'error',
            title: 'ERROR',
            text: result.error,
            showConfirmButton: true,
            confirmButtonText: 'Aceptar'
          });
        }

        if (origenDestino) {
          this.unidadesODValues = result.data.map((u: any) => {
            return {
              value: u.IdUnidad,
              label: u.IdUnidad + '-' + u.Nombre
            }
          });
        } else {
          this.unidadesValues = result.data.map((u: any) => {
            return {
              value: u.IdUnidad,
              label: u.IdUnidad + '-' + u.Nombre
            }
          });
        }
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

  private _subscribeToFgValueChanges(): void {
    this.fg.valueChanges.subscribe(() => {
      this.dataSource = [];
      this._calcularTotales();
    });

    // Centro a analizar
    this.subscription.push(this.fg.controls['idDivision'].valueChanges.subscribe(value => {
      this.fg.controls['idDivisionOD'].setValue(value);
      this.fg.controls['idSubdivision'].setValue(null);
      
      this.subdivisionesValues = [];
      this._getSubdivisiones();
    }));

    this.subscription.push(this.fg.controls['idSubdivision'].valueChanges.subscribe(value => {
      this.fg.controls['idUnidad'].setValue(null);

      this.unidadesValues = [];
      this._getUnidades(false);
    }));

    // Centro Origen/Destino
    this.subscription.push(this.fg.controls['idSubdivisionOD'].valueChanges.subscribe(value => {
      this.fg.controls['idUnidadOD'].setValue(null);

      this.unidadesODValues = [];
      this._getUnidades(true);
    }));
  }

  getTotalImporteE(): number {
    return this.dataSource.length ?
          this.dataSource.map(t => t.ImporteE || 0).reduce((acc, value) => acc + value, 0) : 0;
  }

  getTotalImporteR(): number {
    return this.dataSource.length ?
          this.dataSource.map(t => t.ImporteR || 0).reduce((acc, value) => acc + value, 0) : 0;
  }

  getTotalDiferencia(): number {
    return this.dataSource.length ?
          this.dataSource.map(t => t.Diferencia || 0).reduce((acc, value) => acc + value, 0) : 0;
  }

  conciliar(): void {
    try {
      this.loading = true;

      const payload = {
        FechaInicial: this.fg.controls['fechaInicial'].value,
        FechaFinal: this.fg.controls['fechaFinal'].value,
        IdDivision: this.fg.controls['idDivision'].value || 0,
        IdSubdivision: this.fg.controls['idSubdivision'].value || 0,
        IdUnidad: this.fg.controls['idUnidad'].value || 0,
        IdDivisionOD: this.fg.controls['idDivisionOD'].value || 0,
        IdSubdivisionOD: this.fg.controls['idSubdivisionOD'].value || 0,
        IdUnidadOD: this.fg.controls['idUnidadOD'].value || 0,
        SoloDiferencias: this.fg.controls['soloDiferencias'].value
      };

      this.subscription.push(this._apollo.query<ConciliaInternaDWHQueryResponse>({
        query: conciliaInternaDWHQuery,
        variables: { conciliaInternaDWHInput: payload },
        fetchPolicy: 'network-only'
      }).subscribe(response => {
        this.loading = false;
        const result = response.data.conciliaInternaDWH;

        if (!result.success) {
          return SweetAlert.fire({
            icon: 'error',
            title: 'ERROR',
            text: result.error,
            showConfirmButton: true,
            confirmButtonText: 'Aceptar'
          });
        }

        this.dataSource = result.data;
        this._calcularTotales();
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

  private _calcularTotales() {
    this.dataSource.forEach(element => {
      this.totalEmisor += element.ImporteE;
      this.totalReceptor += element.ImporteR;
      this.totalDiferencia += element.Diferencia;
    });
  }

  async reporte(): Promise<any> {
    try {
      const fechaInicial = this.fg.controls['fechaInicial'].value;
      const fechaFinal = this.fg.controls['fechaFinal'].value;

      const documentDefinitions = {
        pageSize: 'LETTER',
        // pageOrientation: 'landscape',
        content: [
          await this._pdfMakeSvc.getHeaderDefinition('Conciliación Interna Golden DWH'),
          await this._conciliarInternaDWHSvc.getParteAtrasosDefinition(this.dataSource, fechaInicial, fechaFinal),
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
        title: 'ERROR',
        text: err,
        showConfirmButton: true,
        confirmButtonText: 'Aceptar'
      });
    }
  }

}

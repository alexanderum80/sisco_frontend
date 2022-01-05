import { UnidadesService } from './../unidades/shared/services/unidades.service';
import { SubdivisionesService } from './../shared/services/subdivisiones.service';
import { DivisionesService } from './../shared/services/divisiones.service';
import { PdfmakeService } from './../shared/services/pdfmake.service';
import { ConciliaInternaDWHQueryResponse } from './shared/models/concilia-interna-dwh.model';
import { ISelectableOptions } from './../shared/models/selectable-item';
import SweetAlert from 'sweetalert2';
import { Apollo } from 'apollo-angular';
import { Subscription } from 'rxjs';
import { ConcilaInternaDwhService } from './shared/services/concila-interna-dwh.service';
import { FormGroup } from '@angular/forms';
import { Component, OnInit, AfterViewInit } from '@angular/core';

const conciliaInternaDWHQuery = require('graphql-tag/loader!./shared/graphql/concilia-interna-dwh.query.gql');

@Component({
  selector: 'app-concilia-interna-dwh',
  templateUrl: './concilia-interna-dwh.component.html',
  styleUrls: ['./concilia-interna-dwh.component.scss']
})
export class ConciliaInternaDwhComponent implements OnInit, AfterViewInit {
  fg: FormGroup;

  divisionesValues: ISelectableOptions[] = [];
  subdivisionesValues: ISelectableOptions[] = [];
  unidadesValues: ISelectableOptions[] = [];
  divisionesODValues: ISelectableOptions[] = [];
  subdivisionesODValues: ISelectableOptions[] = [];
  unidadesODValues: ISelectableOptions[] = [];

  subdivisionesList: any[] = [];
  unidadesList: any[] = [];

  displayedColumns = ['Documento', 'Emisor', 'FechaE', 'ImporteE', 'Receptor', 'FechaR', 'ImporteR', 'Diferencia'];

  dataSource: any[] = [];

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
    this._getSubdivisiones();
    this._getUnidades();
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
            description: d.IdDivision + '-' + d.Division
          };
        });
        this.divisionesODValues = result.data.map((d: { IdDivision: string; Division: string; }) => {
          return {
            value: d.IdDivision,
            description: d.IdDivision + '-' + d.Division
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
      this.subscription.push(this._subdivisionesSvc.getAllSubdivisiones().subscribe(response => {
        const result = response.getAllSubdivisiones;

        if (!result.success) {
          return SweetAlert.fire({
            icon: 'error',
            title: 'ERROR',
            text: result.error,
            showConfirmButton: true,
            confirmButtonText: 'Aceptar'
          });
        }

        this.subdivisionesList = result.data;
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

  private _getUnidades(): void {
    try {
      this.subscription.push(this._unidadesSvc.getAllUnidades().subscribe(response => {
        const result = response.getAllUnidades;

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
    });

    // Centro a analizar
    this.subscription.push(this.fg.controls['idDivision'].valueChanges.subscribe(value => {
      this.fg.controls['idDivisionOD'].setValue(value);
      this.fg.controls['idSubdivision'].setValue('');

      this.subdivisionesValues = this.subdivisionesList.filter(f => f.IdDivision === value).map(s => {
        return {
          value: s.IdSubdivision,
          description: s.IdSubdivision + '-' + s.Subdivision
        };
      });
    }));

    this.subscription.push(this.fg.controls['idSubdivision'].valueChanges.subscribe(value => {
      this.fg.controls['idUnidad'].setValue('');

      this.unidadesValues = this.unidadesList.filter(f => f.IdSubdivision === value).map(s => {
        return {
          value: s.IdUnidad,
          description: s.IdUnidad + '-' + s.Nombre
        };
      });
    }));

    // Centro Origen/Destino
    this.subscription.push(this.fg.controls['idDivisionOD'].valueChanges.subscribe(value => {
      this.fg.controls['idSubdivisionOD'].setValue('');

      this.subdivisionesODValues = this.subdivisionesList.filter(f => f.IdDivision === value).map(s => {
        return {
          value: s.IdSubdivision,
          description: s.IdSubdivision + '-' + s.Subdivision
        };
      });
    }));

    this.subscription.push(this.fg.controls['idSubdivisionOD'].valueChanges.subscribe(value => {
      this.fg.controls['idUnidadOD'].setValue('');

      this.unidadesODValues = this.unidadesList.filter(f => f.IdSubdivision === value).map(s => {
        return {
          value: s.IdUnidad,
          description: s.IdUnidad + '-' + s.Nombre
        };
      });
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

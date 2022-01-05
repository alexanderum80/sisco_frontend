import { UnidadesService } from './../../unidades/shared/services/unidades.service';
import { DatabasesService } from './../../shared/services/databases.service';
import { MutationActions } from './../../shared/models/mutation-response';
import { DivisionesService } from './../../shared/services/divisiones.service';
import { MaterialService } from './../../shared/services/material.service';
import { MyErrorStateMatcher } from '../../angular-material/models/material-error-state-matcher';
import { UnidadesQueryResponse } from './../../unidades/shared/models/unidades.model';
import { unidadesApi } from './../../unidades/shared/graphql/unidadesApi';
import { toNumber } from 'lodash';
import { ConexionRodasService } from './../shared/services/conexion-rodas.service';
import { FormGroup } from '@angular/forms';
import { ModalService } from './../../shared/services/modal.service';
import { Subscription } from 'rxjs';
import SweetAlert from 'sweetalert2';
import { ISelectableOptions } from './../../shared/models/selectable-item';
import { UsuarioService } from 'src/app/shared/services/usuario.service';
import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-conexion-rodas-form',
  templateUrl: './conexion-rodas-form.component.html',
  styleUrls: ['./conexion-rodas-form.component.scss']
})
export class ConexionRodasFormComponent implements OnInit, AfterViewInit, OnDestroy {
  divisionesValues: ISelectableOptions[] = [];
  unidadesValues: ISelectableOptions[] = [];
  baseDatosValues: ISelectableOptions[] = [];

  matcher = new MyErrorStateMatcher();

  unidadesList: any[] = [];
  action: MutationActions;

  fg: FormGroup;

  loadingDataBase = false;

  subscription: Subscription[] = [];

  constructor(
    private _usuarioSvc: UsuarioService,
    private _conexionRodasSvc: ConexionRodasService,
    private _modalSvc: ModalService,
    private _materialSvc: MaterialService,
    private _divisionesSvc: DivisionesService,
    private _unidadesSvc: UnidadesService,
    private _databasesSvc: DatabasesService,
  ) { }

  ngOnInit(): void {
    this.fg = this._conexionRodasSvc.fg;
    this.action = toNumber(this.fg.controls['idUnidad'].value) === 0 ? 'Agregar' : 'Modificar';
    if (this.action === 'Modificar') {
      this.refreshDataBases();
    }

    this._getDivisiones();
    this._getUnidades();
  }

  ngAfterViewInit(): void {
    this._subscribeToFgValueChange();
  }

  ngOnDestroy(): void {
    this.subscription.forEach(subs => subs.unsubscribe());
  }

  private _subscribeToFgValueChange(): void {
    this.subscription.push(this.fg.controls['idDivision'].valueChanges.subscribe(value => {
      this.fg.controls['idUnidad'].setValue('');
      this._updateUnidadesValue(value);
    }));

    this.subscription.push(this.fg.controls['ip'].valueChanges.subscribe(() => {
      this.fg.controls['baseDatos'].setValue('');
      this.baseDatosValues = [];
    }));

    this.subscription.push(this.fg.controls['usuario'].valueChanges.subscribe(() => {
      this.fg.controls['baseDatos'].setValue('');
      this.baseDatosValues = [];
    }));

    this.subscription.push(this.fg.controls['contrasena'].valueChanges.subscribe(() => {
      this.fg.controls['baseDatos'].setValue('');
      this.baseDatosValues = [];
    }));
  }

  private _updateUnidadesValue(value: number): void {
    this.unidadesValues = this.unidadesList.filter(f => f.IdDivision === value).map(d => {
      return {
        value: d.IdUnidad,
        description: d.IdUnidad + '-' + d.Nombre
      };
    });
  }

  get isAdminPermission(): boolean {
    return this._usuarioSvc.hasAdminPermission();
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
      const that = this;
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

        that.unidadesList = result.data;

        this._updateUnidadesValue(this.fg.controls['idDivision'].value);
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

  refreshDataBases(): void {
    try {
      this.loadingDataBase = true;

      const ip = this.fg.controls['ip'].value;
      const usuario = this.fg.controls['usuario'].value;
      const password = this.fg.controls['contrasena'].value;

      const that = this;
      this.subscription.push(this._databasesSvc.getDataBases(ip, usuario, password).subscribe(response => {
        this.loadingDataBase = false;

        const result = response.getDataBases;

        if (!result.success) {
          return SweetAlert.fire({
            icon: 'error',
            title: 'ERROR',
            text: result.error,
            showConfirmButton: true,
            confirmButtonText: 'Aceptar'
          });
        }

        that.baseDatosValues = result.data.map((d: { name: any; }) => {
          return {
            value: d.name,
            description: d.name
          };
        });
      }));
    } catch (err: any) {
      this.loadingDataBase = false;

      SweetAlert.fire({
        icon: 'error',
        title: 'ERROR',
        text: err,
        showConfirmButton: true,
        confirmButtonText: 'Aceptar'
      });
    }
  }

  save(): void {
    try {
      this.subscription.push(this._conexionRodasSvc.save().subscribe(response => {
        const result = response.saveContaConexion;
        if (!result.success) {
          return SweetAlert.fire({
            icon: 'error',
            title: 'ERROR',
            text: result.error,
            showConfirmButton: true,
            confirmButtonText: 'Aceptar'
          });
        }

        let txtMessage;
        if (this.action === 'Agregar') {
          txtMessage = 'La Conexión se ha creado correctamente.';
        } else {
          txtMessage = 'La Conexión se ha actualizado correctamente.';
        }

        this.closeModal();

        this._materialSvc.openSnackBar(txtMessage);
      }, error => { throw new Error(error); }));
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

  closeModal(): void {
    this._modalSvc.closeModal();
  }

}

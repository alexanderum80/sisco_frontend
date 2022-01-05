import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { MaterialTableColumns } from './../../angular-material/models/mat-table.model';
import { MaterialService } from './../../shared/services/material.service';
import { ConexionRodasService } from './../shared/services/conexion-rodas.service';
import { ConexionRodasFormComponent } from './../conexion-rodas-form/conexion-rodas-form.component';
import { ModalService } from './../../shared/services/modal.service';
import SweetAlert from 'sweetalert2';
import { UsuarioService } from '../../shared/services/usuario.service';
import { sortBy } from 'lodash';
import { MenuItem } from 'primeng/api';
import { ITableColumns } from '../../shared/ui/prime-ng/table/table.model';

@Component({
  selector: 'app-list-conexion-rodas',
  templateUrl: './list-conexion-rodas.component.html',
  styleUrls: ['./list-conexion-rodas.component.scss']
})
export class ListConexionRodasComponent implements OnInit, AfterViewInit, OnDestroy {

  columns: ITableColumns[] = [
    { header: 'División', field: 'Division', type: 'string' },
    { header: 'Unidad', field: 'Unidad', type: 'string' },
    { header: 'Consolidado', field: 'Consolidado', type: 'boolean' },
    { header: 'IP', field: 'IpRodas', type: 'string' },
    { header: 'Usuario', field: 'Usuario', type: 'string' },
    { header: 'Base de Datos', field: 'BaseDatos', type: 'string' },
  ];

  menuItems: MenuItem[] = [
    { id: '0', label: 'Editar', icon: 'mdi mdi-pencil', disabled: false, command: (event) => {
      this.edit(event);
    }},
    { id: '1', label: 'Eliminar', icon: 'mdi mdi-delete-outline', disabled: false, command: (event) => {
      this.delete(event);
    }},
  ];

  conexionesRodas: any[] = [];

  constructor(
    private _usuarioSvc: UsuarioService,
    private _modalSvc: ModalService,
    private _conexionRodasSvc: ConexionRodasService,
    private _materialSvc: MaterialService
  ) { }

  ngOnInit(): void {
  }
  
  ngAfterViewInit(): void {
    this._loadConexionesRodas();
  }

  ngOnDestroy(): void {
    this._conexionRodasSvc.dispose();
  }

  hasAdminPermission(): boolean {
    return this._usuarioSvc.hasAdminPermission();
  }

  private _loadConexionesRodas(): void {
    try {
      this._conexionRodasSvc.subscription.push(this._conexionRodasSvc.loadAllConexionesRodas().subscribe(response => {
        const result = response.getAllContaConexiones;
        if (!result.success) {
          return SweetAlert.fire({
            icon: 'error',
            title: 'ERROR',
            text: result.error,
            showConfirmButton: true,
            confirmButtonText: 'Aceptar',
          });
        }

        this.conexionesRodas = sortBy(result.data, ['IdDivision', 'IdUnidad']);
      }));
    } catch (err: any) {
      SweetAlert.fire({
        icon: 'error',
        title: 'ERROR',
        text: err,
        showConfirmButton: true,
        confirmButtonText: 'Aceptar',
      });
    }
  }

  add(): void {
    try {
      const dataInput = {
        id: '',
        idUnidad: '',
        consolidado: '',
        ip: '',
        usuario: '',
        contrasena: '',
        baseDatos: '',
        idDivision: this._usuarioSvc.usuario.IdDivision,
      };

      this._conexionRodasSvc.fg.patchValue(dataInput);

      this._modalSvc.openModal(ConexionRodasFormComponent);
    } catch (err: any) {
      SweetAlert.fire({
        icon: 'error',
        title: 'ERROR',
        text: err,
        showConfirmButton: true,
        confirmButtonText: 'Aceptar',
      });
    }
  }

  edit(menu: any): void {
    try {
      if (this.hasAdminPermission()) {
      this._conexionRodasSvc.subscription.push(this._conexionRodasSvc.loadConexionById(menu.item.automationId.Id).subscribe(response => {
          const result = response.getContaConexionById;

          if (!result.success) {
            return SweetAlert.fire({
              icon: 'error',
              title: 'ERROR',
              text: result.error,
              showConfirmButton: true,
              confirmButtonText: 'Aceptar',
            });
          }

          const data = result.data;

          const dataInput = {
            id: data.Id,
            idUnidad: data.IdUnidad,
            consolidado: data.Consolidado,
            ip: data.IpRodas,
            usuario: data.Usuario,
            contrasena: data.Contrasena,
            baseDatos: data.BaseDatos,
            idDivision: data.IdDivision,
          };
          this._conexionRodasSvc.fg.patchValue(dataInput);

          this._modalSvc.openModal(ConexionRodasFormComponent);
        }));
      }
    } catch (err: any) {
      SweetAlert.fire({
        icon: 'error',
        title: 'ERROR',
        text: err,
        showConfirmButton: true,
        confirmButtonText: 'Aceptar',
      });
    }
  }

  delete(menu: any): void {
    try {
      if (this.hasAdminPermission()) {
        SweetAlert.fire({
          icon: 'question',
          title: '¿Desea Eliminar la Conexión seleccionada?',
          text: 'No se podrán deshacer los cambios.',
          showConfirmButton: true,
          confirmButtonText: 'Sí',
          showCancelButton: true,
          cancelButtonText: 'No'
        }).then(res => {
          if (res.value) {
            this._conexionRodasSvc.subscription.push(this._conexionRodasSvc.delete(menu.item.automationId.Id).subscribe(response => {
              const result = response.deleteContaConexion;

              if (!result.success) {
                return SweetAlert.fire({
                  icon: 'error',
                  title: 'ERROR',
                  text: result.error,
                  showConfirmButton: true,
                  confirmButtonText: 'Aceptar',
                });
              }

              this._materialSvc.openSnackBar('La Conexión se ha eliminado correctamente.');
            }));
          }
        });
      }
    } catch (err: any) {
      SweetAlert.fire({
        icon: 'error',
        title: 'ERROR',
        text: err,
        showConfirmButton: true,
        confirmButtonText: 'Aceptar',
      });
    }
  }

}

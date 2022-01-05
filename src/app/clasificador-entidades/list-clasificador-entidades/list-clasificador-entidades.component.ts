import { ClasificadorEntidadesFormComponent } from './../clasificador-entidades-form/clasificador-entidades-form.component';
import SweetAlert from 'sweetalert2';
import { ClasificadorEntidadesService } from './../shared/services/clasificador-entidades.service';
import { UsuarioService } from 'src/app/shared/services/usuario.service';
import { MaterialService } from './../../shared/services/material.service';
import { ModalService } from './../../shared/services/modal.service';
import { MaterialTableColumns } from './../../angular-material/models/mat-table.model';
import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-list-clasificador-entidades',
  templateUrl: './list-clasificador-entidades.component.html',
  styleUrls: ['./list-clasificador-entidades.component.scss']
})
export class ListClasificadorEntidadesComponent implements OnInit, AfterViewInit, OnDestroy {
  dataSource: any[];

  displayedColumns: MaterialTableColumns[] = [
    { name: 'Unidad', field: 'Unidad' },
    { name: 'Tipo de Entidad', field: 'TipoEntidad' },
  ];

  menuItems: MenuItem[] = [
    { id: '0', label: 'Editar', icon: 'mdi mdi-pencil', disabled: false, command: (event) => {
      this.edit(event);
    }},
    { id: '1', label: 'Eliminar', icon: 'mdi mdi-delete-outline', disabled: false, command: (event) => {
      this.delete(event);
    }},
  ];

  constructor(
    private _modalSvc: ModalService,
    private _materialSvc: MaterialService,
    private _usuarioSvc: UsuarioService,
    private _clasificadorEntidadesSvc: ClasificadorEntidadesService
  ) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this._loadAllTipoEntidades();
  }

  private _loadAllTipoEntidades(): void {
    try {
      this._clasificadorEntidadesSvc.subscription.push(this._clasificadorEntidadesSvc.loadAllClasificadorEntidades().subscribe(response => {
        const result = response.getAllClasificadorEntidades;

        if (!result.success) {
          return SweetAlert.fire({
            icon: 'error',
            title: 'ERROR',
            text: `Ocurrió el siguiente error: ${ result.error }`,
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
        text: `Ocurrió el siguiente error: ${ err }`,
        showConfirmButton: true,
        confirmButtonText: 'Aceptar'
      });
    }
  }

  ngOnDestroy(): void {
    this._clasificadorEntidadesSvc.dispose();
  }

  hasAdvancedUserPermission(): boolean {
    return this._usuarioSvc.hasAdvancedUserPermission();
  }

  add(): void {
    try {
      if (this.hasAdvancedUserPermission()) {
        const inputData = {
          idUnidad: '',
          idTipoEntidad: '',
        };
        this._clasificadorEntidadesSvc.fg.patchValue(inputData);
        this._modalSvc.openModal(ClasificadorEntidadesFormComponent);
      }
    } catch (err: any) {
      SweetAlert.fire({
        icon: 'error',
        title: 'ERROR',
        text: `Ocurrió el siguiente error: ${ err }`,
        showConfirmButton: true,
        confirmButtonText: 'Aceptar'
      });
    }
  }

  onClicked(values: any): void {
    switch (values.action) {
      case '0':
        this.edit(values.element);
        break;
      case '1':
        this.delete(values.element);
        break;
    }
  }

  edit(clasificadorEntidad: any): void {
    try {
      this._clasificadorEntidadesSvc.subscription.push(
        this._clasificadorEntidadesSvc.loadClasificadorEntidad(clasificadorEntidad.IdUnidad)
        .subscribe(response => {
        const result = response.getClasificadorEntidad;

        if (!result.success) {
          return SweetAlert.fire({
            icon: 'error',
            title: 'ERROR',
            text: `Se produjo el siguiente error: ${ result.error }`,
            showConfirmButton: true,
            confirmButtonText: 'Aceptar'
          });
        }

        const data = result.data;

        const inputData = {
          idUnidad: data.IdUnidad,
          idTipoEntidad: data.IdTipoEntidad,
        };

        this._clasificadorEntidadesSvc.fg.patchValue(inputData);
        this._modalSvc.openModal(ClasificadorEntidadesFormComponent);
      }));
    } catch (err: any) {
      SweetAlert.fire({
        icon: 'error',
        title: 'ERROR',
        text: `Ocurrió el siguiente error: ${ err }`,
        showConfirmButton: true,
        confirmButtonText: 'Aceptar'
      });
    }
  }

  delete(clasificadorEntidad: any): void {
    try {
      if (this.hasAdvancedUserPermission()) {
        SweetAlert.fire({
          icon: 'question',
          title: '¿Desea Eliminar el Clasificador de Entidad seleccionada?',
          text: 'No se podrán deshacer los cambios.',
          showConfirmButton: true,
          confirmButtonText: 'Sí',
          showCancelButton: true,
          cancelButtonText: 'No'
        }).then(res => {
          if (res.value) {
            this._clasificadorEntidadesSvc.subscription.push(
              this._clasificadorEntidadesSvc.delete(clasificadorEntidad.IdUnidad).subscribe(response => {
              const result = response.deleteClasificadorEntidad;

              if (!result.success) {
                return SweetAlert.fire({
                  icon: 'error',
                  title: 'ERROR',
                  text: `Se produjo el siguiente error: ${ result.error }`,
                  showConfirmButton: true,
                  confirmButtonText: 'Aceptar'
                });
              }

              this._materialSvc.openSnackBar('El Clasificador de Entidad se ha eliminado correctamente.');
            }));
          }
        });
      }
    } catch (err: any) {
      SweetAlert.fire({
        icon: 'error',
        title: 'ERROR',
        text: `Ocurrió el siguiente error: ${ err }`,
        showConfirmButton: true,
        confirmButtonText: 'Aceptar'
      });
    }
  }

}

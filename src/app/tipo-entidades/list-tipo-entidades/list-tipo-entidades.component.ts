import { MaterialService } from './../../shared/services/material.service';
import { TipoEntidadesService } from './../shared/services/tipo-entidades.service';
import { UsuarioService } from './../../shared/services/usuario.service';
import { ModalService } from './../../shared/services/modal.service';
import { MaterialTableColumns } from './../../angular-material/models/mat-table.model';
import SweetAlert from 'sweetalert2';
import { TipoEntidadesFormComponent } from './../tipo-entidades-form/tipo-entidades-form.component';
import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-list-tipo-entidades',
  templateUrl: './list-tipo-entidades.component.html',
  styleUrls: ['./list-tipo-entidades.component.scss']
})
export class ListTipoEntidadesComponent implements OnInit, AfterViewInit, OnDestroy {
  dataSource: any[];

  displayedColumns: MaterialTableColumns[] = [
    { name: 'Entidades', field: 'Entidades' },
    { name: 'Descripción', field: 'Descripcion' },
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
    private _tipoEntidadesSvc: TipoEntidadesService
  ) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this._loadAllTipoEntidades();
  }

  private _loadAllTipoEntidades(): void {
    try {
      this._tipoEntidadesSvc.subscription.push(this._tipoEntidadesSvc.loadAllTipoEntidades().subscribe(response => {
        const result = response.getAllTipoEntidades;

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
    this._tipoEntidadesSvc.dispose();
  }

  hasAdvancedUserPermission(): boolean {
    return this._usuarioSvc.hasAdvancedUserPermission();
  }

  add(): void {
    try {
      if (this.hasAdvancedUserPermission()) {
        const inputData = {
          id: '',
          entidades: '',
          descripcion: '',
        };
        this._tipoEntidadesSvc.fg.patchValue(inputData);
        this._modalSvc.openModal('Agregar Tipo de Entidad', TipoEntidadesFormComponent);
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

  edit(tipoEntidad: any): void {
    try {
      this._tipoEntidadesSvc.subscription.push(this._tipoEntidadesSvc.loadTipoEntidadById(tipoEntidad.Id).subscribe(response => {
        const result = response.getTipoEntidadById;

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
          id: data.Id,
          entidades: data.Entidades,
          descripcion: data.Descripcion,
        };

        this._tipoEntidadesSvc.fg.patchValue(inputData);
        this._modalSvc.openModal('Editar Tipo de Entidad', TipoEntidadesFormComponent);
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

  delete(tipoEntidad: any): void {
    try {
      if (this.hasAdvancedUserPermission()) {
        SweetAlert.fire({
          icon: 'question',
          title: '¿Desea Eliminar el Tipo de Entidad seleccionada?',
          text: 'No se podrán deshacer los cambios.',
          showConfirmButton: true,
          confirmButtonText: 'Sí',
          showCancelButton: true,
          cancelButtonText: 'No'
        }).then(res => {
          if (res.value) {
            this._tipoEntidadesSvc.subscription.push(this._tipoEntidadesSvc.delete(tipoEntidad.Id).subscribe(response => {
              const result = response.deleteTipoEntidad;

              if (!result.success) {
                return SweetAlert.fire({
                  icon: 'error',
                  title: 'ERROR',
                  text: `Se produjo el siguiente error: ${ result.error }`,
                  showConfirmButton: true,
                  confirmButtonText: 'Aceptar'
                });
              }

              this._materialSvc.openSnackBar('El Tipo de Entidad se ha eliminado correctamente.');
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

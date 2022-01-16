import { MaterialService } from './../../shared/services/material.service';
import SweetAlert from 'sweetalert2';
import { ElementosGastosFormComponent } from './../elementos-gastos-form/elementos-gastos-form.component';
import { ElementosGastosService } from './../shared/services/elementos-gastos.service';
import { UsuarioService } from './../../shared/services/usuario.service';
import { ModalService } from './../../shared/services/modal.service';
import { MaterialTableColumns } from './../../angular-material/models/mat-table.model';
import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-list-elementos-gastos',
  templateUrl: './list-elementos-gastos.component.html',
  styleUrls: ['./list-elementos-gastos.component.scss']
})
export class ListElementosGastosComponent implements OnInit, AfterViewInit, OnDestroy {
  elementosGastos: any[];

  displayedColumns: MaterialTableColumns[] = [
    { name: 'Elemento', field: 'Egasto' },
    { name: 'Descripción', field: 'Descripcion' },
    { name: 'Uso y Contenido', field: 'UsoContenido' },
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
    private _elementosGastosSvc: ElementosGastosService
  ) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this._loadElementosGastos();
  }

  ngOnDestroy(): void {
    this._elementosGastosSvc.dispose();
  }

  private _loadElementosGastos(): void {
    this._elementosGastosSvc.loadAllElementosGastos().subscribe(response => {
      const result = response.getAllElementosGastos;

      if (!result.success) {
        return SweetAlert.fire({
          icon: 'error',
          title: 'ERROR',
          text: `Ocurrió el siguiente error: ${ result.error }`,
          showConfirmButton: true,
          confirmButtonText: 'Aceptar'
        });
      }

      this.elementosGastos = result.data;
    });
  }

  hasAdvancedUserPermission(): boolean {
    return this._usuarioSvc.hasAdvancedUserPermission();
  }

  add(): void {
    try {
      if (this.hasAdvancedUserPermission()) {
        const inputData = {
          elemento: '',
          descripcion: '',
          usoContenido: '',
          tipoEntidad: '',
          cuentaAsociada: '',
          epigrafe: '',
        };
        this._elementosGastosSvc.fg.patchValue(inputData);
        this._modalSvc.openModal('Agregar Elemento de Gasto', ElementosGastosFormComponent);
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

  edit(elementosGastos: any): void {
    this._elementosGastosSvc.subscription.push(this._elementosGastosSvc.loadElementoGastoById(elementosGastos.Egasto)
    .subscribe(response => {
      const result = response.getElementoGastoById;
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
        elemento: data.Egasto,
        descripcion: data.Descripcion,
        usoContenido: data.UsoContenido,
        tipoEntidad: data.TipoEntidad.split(', ').map(Number),
        cuentaAsociada: data.CuentaAsociada.trimEnd().split(', '),
        epigrafe: data.IdEpigrafe,
      };

      this._elementosGastosSvc.fg.patchValue(inputData);
      this._modalSvc.openModal('Modificar Elemento de Gasto', ElementosGastosFormComponent);
    }));
  }

  delete(elementoGasto: any): void {
    try {
      if (this.hasAdvancedUserPermission()) {
        SweetAlert.fire({
          icon: 'question',
          title: '¿Desea Eliminar el Elemento de Gasto seleccionado?',
          text: 'No se podrán deshacer los cambios.',
          showConfirmButton: true,
          confirmButtonText: 'Sí',
          showCancelButton: true,
          cancelButtonText: 'No'
        }).then(res => {
          if (res.value) {
            const id = elementoGasto.Egasto;

            this._elementosGastosSvc.subscription.push(this._elementosGastosSvc.delete(id).subscribe(response => {
              const result = response.deleteElementoGasto;

              if (result.success === false) {
                return SweetAlert.fire({
                  icon: 'error',
                  title: 'ERROR',
                  text: `Ocurrió el siguiente error: ${ result.error }`,
                  showConfirmButton: true,
                  confirmButtonText: 'Aceptar'
                });
              }

              this._materialSvc.openSnackBar('El Elemento de Gasto se ha eliminado correctamente.');
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

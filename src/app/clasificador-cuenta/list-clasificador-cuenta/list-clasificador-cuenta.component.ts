import { MaterialTableColumns } from './../../angular-material/models/mat-table.model';
import { TiposClasificadorCuenta } from './../shared/models/clasificador-cuenta.model';
import SweetAlert from 'sweetalert2';
import { ClasificadorCuentaFormComponent } from './../clasificador-cuenta-form/clasificador-cuenta-form.component';
import { ClasificadorCuentaService } from './../shared/service/clasificador-cuenta.service';
import { MaterialService } from './../../shared/services/material.service';
import { UsuarioService } from 'src/app/shared/services/usuario.service';
import { ModalService } from './../../shared/services/modal.service';
import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-list-clasificador-cuenta',
  templateUrl: './list-clasificador-cuenta.component.html',
  styleUrls: ['./list-clasificador-cuenta.component.scss']
})
export class ListClasificadorCuentaComponent implements OnInit, AfterViewInit, OnDestroy {
  clasificadorCuentaConso: any[];
  clasificadorCuentaCentro: any[];
  clasificadorCuentaComplejo: any[];

  displayedColumns: MaterialTableColumns[] = [
    { name: 'Cuenta', field: 'Cuenta' },
    { name: 'SubCuenta', field: 'SubCuenta' },
    { name: 'Descripción', field: 'Descripcion' },
    { name: 'Naturaleza', field: 'Naturaleza' },
    { name: 'Obligación', field: 'Obligacion' },
    { name: 'Terminal', field: 'Terminal' },
    { name: 'Crit1', field: 'Crit1' },
    { name: 'Crit2', field: 'Crit2' },
    { name: 'Crit3', field: 'Crit3' },
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
    private _apollo: Apollo,
    private _modalSvc: ModalService,
    private _usuarioSvc: UsuarioService,
    private _materialSvc: MaterialService,
    private _clasificadorCuentaSvc: ClasificadorCuentaService
  ) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    try {
      this._clasificadorCuentaSvc.subscription.push(this._clasificadorCuentaSvc.loadAllClasificadorCuenta().subscribe(response => {
        const result = response.getAllClasificadorCuentas;
        if (!result.success) {
          return SweetAlert.fire({
            icon: 'error',
            title: 'ERROR',
            text: result.error,
            confirmButtonText: 'Aceptar'
          });
        }

        this.clasificadorCuentaConso = result.data.filter((f: { TipoClasificador: TiposClasificadorCuenta; }) => f.TipoClasificador === TiposClasificadorCuenta.Consolidado);
        this.clasificadorCuentaCentro = result.data.filter((f: { TipoClasificador: TiposClasificadorCuenta; }) => f.TipoClasificador === TiposClasificadorCuenta.Centro);
        this.clasificadorCuentaComplejo = result.data.filter((f: { TipoClasificador: TiposClasificadorCuenta; }) => f.TipoClasificador === TiposClasificadorCuenta.Complejo);
      }, error => { throw new Error(error); }));
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
    this._clasificadorCuentaSvc.dispose();
  }

  hasAdvancedUserPermission(): boolean {
    return this._usuarioSvc.hasAdvancedUserPermission();
  }

  add(): void {
    try {
      if (this.hasAdvancedUserPermission()) {
        const inputData = {
          cuenta: '',
          subcuenta: '',
          descripcion: '',
          naturaleza: '',
          crit1: '',
          crit2: '',
          crit3: '',
          obligacion: false,
          tipoClasificador: '',
          seUtiliza: '',
          terminal: false,
          crit1Consolidacion: '',
          crit2Consolidacion: '',
          crit3Consolidacion: '',
        };
        this._clasificadorCuentaSvc.fg.patchValue(inputData);
        this._modalSvc.openModal('Agregar Cuenta', ClasificadorCuentaFormComponent);
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

  onClicked(values: { action: any; element: any; }): void {
    switch (values.action) {
      case '0':
        this.edit(values.element);
        break;
      case '1':
        this.delete(values.element);
        break;
    }
  }

  edit(clasificador: { Cuenta: string; SubCuenta: string; TipoClasificador: string; }): void {
    try {
      if (this.hasAdvancedUserPermission()) {
        this._clasificadorCuentaSvc.subscription.push(
          this._clasificadorCuentaSvc.loadClasificadorCuenta(clasificador.Cuenta, clasificador.SubCuenta, clasificador.TipoClasificador)
          .subscribe(response => {
            const result = response.getClasificadorCuenta;
            if (!result.success) {
              return SweetAlert.fire({
                icon: 'error',
                title: 'ERROR',
                text: result.error,
                confirmButtonText: 'Aceptar'
              });
            }

            const data = result.data;

            const inputData = {
              cuenta: data.Cuenta,
              subcuenta: data.SubCuenta,
              descripcion: data.Descripcion,
              naturaleza: data.Naturaleza,
              crit1: data.Crit1,
              crit2: data.Crit2,
              crit3: data.Crit3,
              obligacion: data.Obligacion,
              tipoClasificador: data.TipoClasificador,
              seUtiliza: data.SeUtiliza.split(', ').map(Number),
              terminal: data.Terminal,
              crit1Consolidacion: data.Crit1Consolidacion,
              crit2Consolidacion: data.Crit2Consolidacion,
              crit3Consolidacion: data.Crit3Consolidacion,
            };

            this._clasificadorCuentaSvc.fg.patchValue(inputData);
            this._modalSvc.openModal('Modificar Cuenta', ClasificadorCuentaFormComponent);
          }, error => { throw new Error(error); })
        );
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

  delete(clasificador: any): void {
    try {
      if (this.hasAdvancedUserPermission()) {
        SweetAlert.fire({
          icon: 'question',
          title: '¿Desea Eliminar la Cuenta seleccionada?',
          text: 'No se podrán deshacer los cambios.',
          showConfirmButton: true,
          confirmButtonText: 'Sí',
          showCancelButton: true,
          cancelButtonText: 'No'
        }).then(res => {
          if (res.value) {
            this._clasificadorCuentaSvc.subscription.push(this._clasificadorCuentaSvc.delete(clasificador).subscribe(response => {
              const result = response.deleteClasificadorCuenta;

              if (!result.success) {
                return SweetAlert.fire({
                  icon: 'error',
                  title: 'ERROR',
                  text: `Ocurrió el siguiente error: ${ result.error }`,
                  showConfirmButton: true,
                  confirmButtonText: 'Aceptar'
                });
              }

              this._materialSvc.openSnackBar('La Cuenta se ha eliminado correctamente.');
            }, error => { throw new Error(error); }));
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

import { MaterialService } from './../../shared/services/material.service';
import SweetAlert from 'sweetalert2';
import { EpigrafesService } from './../shared/services/epigrafes.service';
import { UsuarioService } from './../../shared/services/usuario.service';
import { ModalService } from './../../shared/services/modal.service';
import { MaterialTableColumns } from './../../angular-material/models/mat-table.model';
import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { EpigrafesFormComponent } from '../epigrafes-form/epigrafes-form.component';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-list-epigrafes',
  templateUrl: './list-epigrafes.component.html',
  styleUrls: ['./list-epigrafes.component.scss']
})
export class ListEpigrafesComponent implements OnInit, AfterViewInit, OnDestroy {
  epigrafes: any[];

  displayedColumns: MaterialTableColumns[] = [
    { name: 'Epígrafe', field: 'Epigrafe' },
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
    private _epigrafesSvc: EpigrafesService
  ) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this._loadEpigrafes();
  }

  private _loadEpigrafes(): void {
    this._epigrafesSvc.subscription.push(this._epigrafesSvc.loadAllEpigrafes().subscribe(response => {
      const result = response.getAllEpigrafes;

      if (!result.success) {
        return SweetAlert.fire({
          icon: 'error',
          title: 'ERROR',
          text: `Ocurrió el siguiente error: ${ result.error }`,
          showConfirmButton: true,
          confirmButtonText: 'Aceptar'
        });
      }

      this.epigrafes = result.data;
    }));
  }

  ngOnDestroy(): void {
    this._epigrafesSvc.dispose();
  }

  hasAdvancedUserPermission(): boolean {
    return this._usuarioSvc.hasAdvancedUserPermission();
  }

  add(): void {
    try {
      if (this.hasAdvancedUserPermission()) {
        const inputData = {
          idEpigrafe: 0,
          epigrafe: '',
        };
        this._epigrafesSvc.fg.patchValue(inputData);
        this._modalSvc.openModal('Agregar Epígrafe', EpigrafesFormComponent);
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

  edit(clasificador: any): void {
    this._epigrafesSvc.subscription.push(this._epigrafesSvc.loadEpigrafeById(clasificador.IdEpigafre).subscribe(response => {
      const result = response.getEpigrafeById;

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
        idEpigrafe: data.IdEpigafre,
        epigrafe: data.Epigrafe,
      };

      this._epigrafesSvc.fg.patchValue(inputData);
      this._modalSvc.openModal('Modificar Epígrafe', EpigrafesFormComponent);
    }));
  }

  delete(clasificador: any): void {
    try {
      if (this.hasAdvancedUserPermission()) {
        SweetAlert.fire({
          icon: 'question',
          title: '¿Desea Eliminar el Epígrafe seleccionado?',
          text: 'No se podrán deshacer los cambios.',
          showConfirmButton: true,
          confirmButtonText: 'Sí',
          showCancelButton: true,
          cancelButtonText: 'No'
        }).then(res => {
          if (res.value) {
            this._epigrafesSvc.subscription.push(this._epigrafesSvc.delete(clasificador.IdEpigafre).subscribe(response => {
              const result = response.deleteEpigrafe;

              if (result.success === false) {
                return SweetAlert.fire({
                  icon: 'error',
                  title: 'ERROR',
                  text: `Ocurrió el siguiente error: ${ result.error }`,
                  showConfirmButton: true,
                  confirmButtonText: 'Aceptar'
                });
              }

              this._materialSvc.openSnackBar('El Epígrafe se ha eliminado correctamente.');
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

import { MessageService } from 'primeng/api';
import {
  IActionItemClickedArgs,
  ActionClicked,
} from './../../shared/models/list-items';
import { ITableColumns } from './../../shared/ui/prime-ng/table/table.model';
import SweetAlert from 'sweetalert2';
import { EpigrafesService } from './../shared/services/epigrafes.service';
import { UsuarioService } from './../../shared/services/usuario.service';
import { DinamicDialogService } from './../../shared/ui/prime-ng/dinamic-dialog/dinamic-dialog.service';
import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { EpigrafesFormComponent } from '../epigrafes-form/epigrafes-form.component';
import { isArray } from 'lodash';

@Component({
  selector: 'app-list-epigrafes',
  templateUrl: './list-epigrafes.component.html',
  styleUrls: ['./list-epigrafes.component.scss'],
})
export class ListEpigrafesComponent implements AfterViewInit, OnDestroy {
  epigrafes: any[];

  displayedColumns: ITableColumns[] = [
    { header: 'Epígrafe', field: 'Epigrafe', type: 'string' },
  ];

  constructor(
    private _dinamicDialogSvc: DinamicDialogService,
    private _msgSvc: MessageService,
    private _usuarioSvc: UsuarioService,
    private _epigrafesSvc: EpigrafesService
  ) {}

  ngAfterViewInit(): void {
    this._loadEpigrafes();
  }

  ngOnDestroy(): void {
    this._epigrafesSvc.dispose();
  }

  private _loadEpigrafes(): void {
    this._epigrafesSvc.subscription.push(
      this._epigrafesSvc.loadAllEpigrafes().subscribe(response => {
        const result = response.getAllEpigrafes;

        if (!result.success) {
          return SweetAlert.fire({
            icon: 'error',
            title: 'ERROR',
            text: `Ocurrió el siguiente error: ${result.error}`,
            showConfirmButton: true,
            confirmButtonText: 'Aceptar',
          });
        }

        this.epigrafes = result.data;
      })
    );
  }

  hasAdvancedUserPermission(): boolean {
    return this._usuarioSvc.hasAdvancedUserPermission();
  }

  actionClicked(event: IActionItemClickedArgs) {
    switch (event.action) {
      case ActionClicked.Add:
        this._add();
        break;
      case ActionClicked.Edit:
        this._edit(event.item);
        break;
      case ActionClicked.Delete:
        this._delete(event.item);
        break;
    }
  }

  private _add(): void {
    try {
      if (this.hasAdvancedUserPermission()) {
        const inputData = {
          idEpigrafe: 0,
          epigrafe: '',
        };
        this._epigrafesSvc.fg.patchValue(inputData);

        this._dinamicDialogSvc.open('Agregar Epígrafe', EpigrafesFormComponent);
        this._epigrafesSvc.subscription.push(
          this._dinamicDialogSvc.ref.onClose.subscribe((message: string) => {
            if (message) {
              this._msgSvc.add({
                severity: 'success',
                summary: 'Satisfactorio',
                detail: message,
              });
            }
          })
        );
      }
    } catch (err: any) {
      SweetAlert.fire({
        icon: 'error',
        title: 'ERROR',
        text: `Ocurrió el siguiente error: ${err}`,
        showConfirmButton: true,
        confirmButtonText: 'Aceptar',
      });
    }
  }

  private _edit(clasificador: any): void {
    this._epigrafesSvc.subscription.push(
      this._epigrafesSvc
        .loadEpigrafeById(clasificador.IdEpigafre)
        .subscribe(response => {
          const result = response.getEpigrafeById;

          if (!result.success) {
            return SweetAlert.fire({
              icon: 'error',
              title: 'ERROR',
              text: result.error,
              confirmButtonText: 'Aceptar',
            });
          }

          const data = result.data;

          const inputData = {
            idEpigrafe: data.IdEpigafre,
            epigrafe: data.Epigrafe,
          };

          this._epigrafesSvc.fg.patchValue(inputData);

          this._dinamicDialogSvc.open(
            'Modificar Epígrafe',
            EpigrafesFormComponent
          );
          this._epigrafesSvc.subscription.push(
            this._dinamicDialogSvc.ref.onClose.subscribe((message: string) => {
              if (message) {
                this._msgSvc.add({
                  severity: 'success',
                  summary: 'Satisfactorio',
                  detail: message,
                });
              }
            })
          );
        })
    );
  }

  private _delete(data: any): void {
    try {
      if (this.hasAdvancedUserPermission()) {
        SweetAlert.fire({
          icon: 'question',
          title: '¿Desea Eliminar el Epígrafe seleccionado?',
          text: 'No se podrán deshacer los cambios.',
          showConfirmButton: true,
          confirmButtonText: 'Sí',
          showCancelButton: true,
          cancelButtonText: 'No',
        }).then(res => {
          if (res.value) {
            const IDsToRemove: number[] = !isArray(data)
              ? [data.IdEpigafre]
              : data.map(d => {
                  return d.IdEpigafre;
                });

            this._epigrafesSvc.subscription.push(
              this._epigrafesSvc.delete(IDsToRemove).subscribe(response => {
                const result = response.deleteEpigrafe;

                if (result.success === false) {
                  return SweetAlert.fire({
                    icon: 'error',
                    title: 'ERROR',
                    text: `Ocurrió el siguiente error: ${result.error}`,
                    showConfirmButton: true,
                    confirmButtonText: 'Aceptar',
                  });
                }

                this._msgSvc.add({
                  severity: 'success',
                  summary: 'Satisfactorio',
                  detail: 'El Epígrafe se ha eliminado correctamente.',
                });
              })
            );
          }
        });
      }
    } catch (err: any) {
      SweetAlert.fire({
        icon: 'error',
        title: 'ERROR',
        text: `Ocurrió el siguiente error: ${err}`,
        showConfirmButton: true,
        confirmButtonText: 'Aceptar',
      });
    }
  }
}

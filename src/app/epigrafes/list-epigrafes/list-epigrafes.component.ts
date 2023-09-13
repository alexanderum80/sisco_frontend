import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from './../../shared/services/authentication.service';
import { DefaultTopLeftButtonsTable } from './../../shared/models/table-buttons';
import { DefaultInlineButtonsTable } from '../../shared/models/table-buttons';
import { IButtons } from './../../shared/ui/prime-ng/button/button.model';
import {
  IActionItemClickedArgs,
  ActionClicked,
} from './../../shared/models/list-items';
import { ITableColumns } from './../../shared/ui/prime-ng/table/table.model';
import { EpigrafesService } from './../shared/services/epigrafes.service';
import { DinamicDialogService } from './../../shared/ui/prime-ng/dinamic-dialog/dinamic-dialog.service';
import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { EpigrafesFormComponent } from '../epigrafes-form/epigrafes-form.component';
import { cloneDeep, isArray } from 'lodash';
import { SweetalertService } from 'src/app/shared/helpers/sweetalert.service';
import { IEpigrafes } from '../shared/models/epigrafes.model';

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

  inlineButtons: IButtons[] = [];
  topLeftButtons: IButtons[] = [];

  loading = true;

  constructor(
    private _authSvc: AuthenticationService,
    private _dinamicDialogSvc: DinamicDialogService,
    private _toastrSvc: ToastrService,
    private _epigrafesSvc: EpigrafesService,
    private _swalSvc: SweetalertService
  ) {
    if (this.hasAdvancedUserPermission()) {
      this.inlineButtons = DefaultInlineButtonsTable;
      this.topLeftButtons = DefaultTopLeftButtonsTable;
    }
  }

  ngAfterViewInit(): void {
    this._loadEpigrafes();
  }

  ngOnDestroy(): void {
    this._epigrafesSvc.dispose();
  }

  private _loadEpigrafes(): void {
    this._epigrafesSvc.subscription.push(
      this._epigrafesSvc.loadAllEpigrafes().subscribe({
        next: res => {
          this.loading = false;

          this.epigrafes = cloneDeep(res.getAllEpigrafes);
        },
        error: err => {
          this._swalSvc.error(err);
        },
      })
    );
  }

  hasAdvancedUserPermission(): boolean {
    return this._authSvc.hasAdvancedUserPermission();
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
              this._toastrSvc.success(message, 'Satisfactorio');
            }
          })
        );
      }
    } catch (err: any) {
      this._swalSvc.error(err);
    }
  }

  private _edit(clasificador: IEpigrafes): void {
    this._epigrafesSvc.subscription.push(
      this._epigrafesSvc.loadEpigrafeById(clasificador.IdEpigrafe).subscribe({
        next: res => {
          const result = res.getEpigrafeById;

          const inputData = {
            idEpigrafe: result.IdEpigrafe,
            epigrafe: result.Epigrafe,
          };

          this._epigrafesSvc.fg.patchValue(inputData);

          this._dinamicDialogSvc.open(
            'Modificar Epígrafe',
            EpigrafesFormComponent
          );
          this._epigrafesSvc.subscription.push(
            this._dinamicDialogSvc.ref.onClose.subscribe((message: string) => {
              if (message) {
                this._toastrSvc.success(message, 'Satisfactorio');
              }
            })
          );
        },
        error: err => {
          this._swalSvc.error(err);
        },
      })
    );
  }

  private _delete(data: any): void {
    try {
      if (this.hasAdvancedUserPermission()) {
        this._swalSvc
          .question(
            'No se podrán deshacer los cambios.',
            '¿Desea Eliminar el Epígrafe seleccionado?'
          )
          .then(res => {
            if (res === ActionClicked.Yes) {
              const IDsToRemove: number[] = !isArray(data)
                ? [data.IdEpigafre]
                : data.map(d => {
                    return d.IdEpigafre;
                  });

              this._epigrafesSvc.subscription.push(
                this._epigrafesSvc.delete(IDsToRemove).subscribe(res => {
                  const result = res.deleteEpigrafe;

                  if (result.success === false) {
                    return this._swalSvc.error(result.error);
                  }

                  this._toastrSvc.success(
                    'El Epígrafe se ha eliminado correctamente.',
                    'Satisfactorio'
                  );
                })
              );
            }
          });
      }
    } catch (err: any) {
      this._swalSvc.error(err);
    }
  }
}
